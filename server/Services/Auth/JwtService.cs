using App.DB;
using App.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace App.Services
{
    public interface IJwtService
    {
        Task<IJwtSignPayload> JwtSign(UserModel user, string IpAddress);
        Task<string> JwtRefreshSign(string refreshToken);
        Task RevokeRefreshToken(string refreshToken);
        Task RevokeAllSessions(string email);
        Models.JwtPayload? JwtGetPayload(IEnumerable<Claim> claims);
    }

    public class JwtService : IJwtService
    {
        // Constructor
        private readonly IConfiguration _config;
        private readonly AddDbContext _context;


        public JwtService(IConfiguration config, AddDbContext context)
        {
            _config = config;
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }
        // Private methods
        private string GenerateToken(string secret, int lifetimeHours, UserModel? user = null, string? sessionId = null)
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
                claims.Add(new Claim("email", user.Email));
                claims.Add(new Claim("nickname", user.Nickname));
                claims.Add(new Claim("role", user.Role.ToString()));
            }
            // Refresh token claims
            else if (sessionId != null)
                claims.Add(new Claim("sessionId", sessionId));

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(lifetimeHours),
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private async Task AddTokenToDb(string sessionId, string token, string userEmail, string IpAddress)
        {
            var refreshTokenModel = new RefreshTokenModel
            {
                SessionId = sessionId,
                TokenHash = BCrypt.Net.BCrypt.HashPassword(token),
                IpAddress = IpAddress,
                Expires = DateTime.UtcNow.AddHours(Constants.Main.RefreshTokenLifetimeH),
                Created = DateTime.UtcNow,
                Email = userEmail
            };
            _context.RefreshTokens.Add(refreshTokenModel);
            await _context.SaveChangesAsync();
        }
        private ClaimsPrincipal? ValidateRefreshTokenAndGetClaims(string token)
        {
            var refreshSecret = _config["Jwt:RefreshSecret"];
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
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidAudience = _config["Jwt:Audience"],
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
        private async Task<RefreshTokenModel?> GetRefreshTokenDataFromDbAsync(string refreshToken)
        {
            var principal = ValidateRefreshTokenAndGetClaims(refreshToken) ?? throw new UnauthorizedAccessException("Invalid refresh token");

            var sessionId = principal.FindFirst("sessionId")?.Value;

            // Validate refresh token against DB
            var tokenData = await _context.RefreshTokens.Where(t => t.SessionId == sessionId && t.Revoked == null && t.Expires > DateTime.UtcNow).FirstOrDefaultAsync();
            if (tokenData == null || !BCrypt.Net.BCrypt.Verify(refreshToken, tokenData.TokenHash))
                throw new UnauthorizedAccessException("Invalid refresh token");

            return tokenData;
        }

        // Public methods
        public async Task<IJwtSignPayload> JwtSign(UserModel user, string IpAddress)
        {
            var accessSecret = _config["Jwt:AccessSecret"];
            var refreshSecret = _config["Jwt:RefreshSecret"];
            if (string.IsNullOrEmpty(accessSecret) || string.IsNullOrEmpty(refreshSecret))
                throw new ArgumentNullException("JWT secrets are not configured.");

            string sessionId = Guid.NewGuid().ToString();

            var accessToken = GenerateToken(accessSecret, Constants.Main.AccessTokenLifetimeH, user);
            var refreshToken = GenerateToken(refreshSecret, Constants.Main.RefreshTokenLifetimeH, null, sessionId);

            await AddTokenToDb(sessionId, refreshToken, user.Email, IpAddress);

            return new JwtSignPayload
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }
        public async Task<string> JwtRefreshSign(string refreshToken)
        {
            // Get refresh token data from DB
            var tokenData = await GetRefreshTokenDataFromDbAsync(refreshToken) ?? throw new UnauthorizedAccessException("Invalid refresh token");

            // Get user associated with the refresh token session
            UserModel? user = await _context.Users.FirstOrDefaultAsync(u => u.Email == tokenData.Email) ?? throw new UnauthorizedAccessException("User not found"); ;

            // Generate new access token
            var accessSecret = _config["Jwt:AccessSecret"];
            if (string.IsNullOrEmpty(accessSecret))
                throw new ArgumentNullException("JWT access secret is not configured.");

            var accessToken = GenerateToken(accessSecret, Constants.Main.AccessTokenLifetimeH, user);
            return accessToken;
        }
        public async Task RevokeRefreshToken(string refreshToken)
        {
            var tokenEntry = await GetRefreshTokenDataFromDbAsync(refreshToken) ?? throw new UnauthorizedAccessException("Invalid refresh token");

            tokenEntry.Revoked = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
        public async Task RevokeAllSessions(string email)
        {
            var activeSessions = await _context.RefreshTokens.Where(t => t.Email == email && t.Revoked == null).ToListAsync();
            if (activeSessions.Count == 0) throw new BadHttpRequestException("No active sessions");

            var revocationTime = DateTime.UtcNow;
            foreach (var session in activeSessions)
            {
                session.Revoked = revocationTime;
            }

            await _context.SaveChangesAsync();
        }
        public Models.JwtPayload? JwtGetPayload(IEnumerable<Claim> claims)
        {
            var emailClaim = claims.FirstOrDefault(c => c.Type.EndsWith("emailaddress", StringComparison.OrdinalIgnoreCase));
            var roleClaim = claims.FirstOrDefault(c => c.Type.EndsWith("role", StringComparison.OrdinalIgnoreCase));
            var nicknameClaim = claims.FirstOrDefault(c => c.Type.EndsWith("nickname", StringComparison.OrdinalIgnoreCase));

            if (emailClaim == null || nicknameClaim == null || roleClaim == null)
                return null;

            return new App.Models.JwtPayload
            {
                Email = emailClaim.Value,
                Nickname = nicknameClaim.Value,
                Role = roleClaim.Value
            };
        }
    }
}