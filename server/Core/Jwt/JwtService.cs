using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using App.Core.Database;
using App.Core.Entities;
using App.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace App.Core.Jwt;

public class JwtService
{
    private readonly JwtConfig _config;
    private readonly AppDbContext _context;

    public int RefreshTokenLifetime => _config.RefreshTokenLifetimeH;

    public JwtService(JwtConfig config, AppDbContext context)
    {
        _config = config;
        _context = context;
    }



    public async Task<JwtTokenResult> JwtSign(User user, string IpAddress)
    {
        var accessSecret = _config.AccessSecret;
        var refreshSecret = _config.RefreshSecret;
        if (string.IsNullOrEmpty(accessSecret) || string.IsNullOrEmpty(refreshSecret))
            throw new ArgumentNullException("JWT secrets are not configured.");

        Guid sessionId = Guid.NewGuid();

        var accessToken = GenerateToken(accessSecret, _config.AccessTokenLifetimeH, user);
        var refreshToken = GenerateToken(refreshSecret, _config.RefreshTokenLifetimeH, null, sessionId);

        await AddTokenToDb(refreshToken, user.Id, IpAddress, sessionId);

        return new JwtTokenResult(accessToken, refreshToken);
    }


    public async Task<string> JwtRefreshSign(string refreshToken)
    {
        // Get refresh token data from DB
        var tokenData = await GetRefreshTokenDataFromDbAsync(refreshToken) ?? throw new UnauthorizedAccessException("Invalid refresh token");
        User? user = tokenData.User;

        // Generate new access token
        var accessSecret = _config.AccessSecret;
        if (string.IsNullOrEmpty(accessSecret))
            throw new ArgumentNullException("JWT access secret is not configured.");

        var accessToken = GenerateToken(accessSecret, _config.AccessTokenLifetimeH, user);
        return accessToken;
    }
    public async Task RevokeRefreshToken(string refreshToken)
    {
        var tokenEntry = await GetRefreshTokenDataFromDbAsync(refreshToken) ?? throw new UnauthorizedAccessException("Invalid refresh token");

        tokenEntry.RevokedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }
    public async Task RevokeAllSessions(Guid userId)
    {
        var activeSessions = await _context.RefreshTokens.Where(t => t.UserId == userId && t.IsActive).ToListAsync();
        if (activeSessions.Count == 0) throw new BadHttpRequestException("No active sessions");

        var revocationTime = DateTime.UtcNow;
        foreach (var session in activeSessions)
        {
            session.RevokedAt = revocationTime;
        }

        await _context.SaveChangesAsync();
    }
    public JwtAccessPayload? JwtGetPayload(IEnumerable<Claim> claims)
    {
        var userIdStr = claims.FirstOrDefault(c => c.Type.EndsWith("userid", StringComparison.OrdinalIgnoreCase))?.Value;
        var emailStr = claims.FirstOrDefault(c =>
         c.Type.EndsWith("email", StringComparison.OrdinalIgnoreCase) ||
         c.Type.EndsWith("emailaddress", StringComparison.OrdinalIgnoreCase))?.Value;
        var roleStr = claims.FirstOrDefault(c => c.Type.EndsWith("role", StringComparison.OrdinalIgnoreCase))?.Value;
        var nicknameClaim = claims.FirstOrDefault(c => c.Type.EndsWith("nickname", StringComparison.OrdinalIgnoreCase));

        if (string.IsNullOrEmpty(userIdStr) || string.IsNullOrEmpty(emailStr) || nicknameClaim == null || string.IsNullOrEmpty(roleStr))
            return null;
        if (!Guid.TryParse(userIdStr, out var userId))
            return null;
        if (!Enum.TryParse<UserRole>(roleStr, out var role))
            return null;


        return new JwtAccessPayload(userId, emailStr, nicknameClaim.Value, role);


    }

    // private methods
    private string GenerateToken(string secret, int lifetimeHours, User? user = null, Guid? sessionId = null)
    {
        if (string.IsNullOrEmpty(secret))
            throw new ArgumentNullException("JWT secret is not configured.");

        // Create signing credentials
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        // Define claims
        var claims = new List<Claim>();
        // Access token claims      
        if (user != null)
        {
            claims.Add(new Claim("userid", user.Id.ToString()));
            claims.Add(new Claim("email", user.Email));
            claims.Add(new Claim("nickname", user.Nickname));
            claims.Add(new Claim("role", user.Role.ToString()));
        }
        // Refresh token claims
        if (sessionId != null)
            claims.Add(new Claim("sessionId", sessionId.Value.ToString()));

        var token = new JwtSecurityToken(
            issuer: _config.Issuer,
            audience: _config.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(lifetimeHours),
            signingCredentials: credentials
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    private async Task AddTokenToDb(string token, Guid userId, string IpAddress, Guid sessionId)
    {
        using var sha256 = SHA256.Create();
        byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(token));
        string tokenHash = Convert.ToBase64String(hashBytes);


        var refreshToken = new RefreshToken
        {
            TokenHash = tokenHash,
            IpAddress = IpAddress,
            ExpiresAt = DateTime.UtcNow.AddHours(_config.RefreshTokenLifetimeH),
            UserId = userId,
            Id = sessionId
        };
        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();
    }
    private ClaimsPrincipal? ValidateRefreshTokenAndGetClaims(string token)
    {
        var refreshSecret = _config.RefreshSecret;
        if (string.IsNullOrEmpty(refreshSecret))
            throw new ArgumentNullException("JWT refresh secret is not configured.");

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(refreshSecret);
        try
        {
            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _config.Issuer,
                ValidAudience = _config.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return principal;
        }
        catch
        {
            return null;
        }
    }
    private async Task<RefreshToken?> GetRefreshTokenDataFromDbAsync(string refreshToken)
    {
        var principal = ValidateRefreshTokenAndGetClaims(refreshToken) ?? throw new UnauthorizedAccessException("Invalid refresh token");

        var sessionIdStr = principal.FindFirst("sessionId")?.Value;
        if (string.IsNullOrEmpty(sessionIdStr) || !Guid.TryParse(sessionIdStr, out var parsedSessionId))
        {
            throw new UnauthorizedAccessException("Invalid refresh token payload");
        }

        // Validate refresh token against DB
        var tokenData = await _context.RefreshTokens
    .Include(t => t.User)
    .Where(t => t.Id == parsedSessionId && t.IsActive)
    .FirstOrDefaultAsync();

        using var sha256 = SHA256.Create();
        byte[] hasBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(refreshToken));
        string clientHash = Convert.ToBase64String(hasBytes);
        if (tokenData == null || tokenData.TokenHash != clientHash)
            throw new UnauthorizedAccessException("Invalid refresh token");

        return tokenData;
    }
}