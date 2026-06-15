using App.Core.Audit;
using App.Core.Jwt;
using App.Shared.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace App.Features.Auth;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly JwtService _jwtService;

    public AuthController(AuthService authService, JwtService jwtService)
    {
        _authService = authService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    [Audit]
    public async Task<IActionResult> Register([FromBody] Requests.RegisterRequest request)
    {
        var response = await _authService.RegisterAsync(request);
        return Ok(response);
    }
    [HttpPost("login")]
    [Audit]
    public async Task<IActionResult> Login([FromBody] Requests.LoginRequest request)
    {
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown ip";
        var tokens = await _authService.LoginAsync(request, ipAddress);
        var refreshTokenLifetimeH = _jwtService.RefreshTokenLifetime;
        Response.Headers.Append("Authorization", $"Bearer {tokens.AccessToken}");
        Response.Cookies.Append("refresh", tokens.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddHours(refreshTokenLifetimeH),
            SameSite = SameSiteMode.Lax,
            Secure = true
        });
        return Ok(new MessageResponse("login successfully"));
    }
    [HttpDelete("logout")]
    [Authorize]
    [Audit]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refresh"];
        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized(new MessageResponse("Refresh token is missing"));

        await _jwtService.RevokeRefreshToken(refreshToken);
        Response.Cookies.Delete("refresh");
        return Ok(new MessageResponse("Logged out successfully"));
    }
    [HttpDelete("revoke-sessions")]
    [Authorize]
    [Audit]
    public async Task<IActionResult> LogoutEachSession()
    {
        JwtAccessPayload? payload = _jwtService.JwtGetPayload(User.Claims);
        if (payload == null) return Unauthorized();
        await _jwtService.RevokeAllSessions(payload.UserId);

        Response.Cookies.Delete("refresh");
        return Ok(new MessageResponse("All user sessions was revoked"));
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        var refreshToken = Request.Cookies["refresh"];
        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized();

        string newAccessToken = await _jwtService.JwtRefreshSign(refreshToken);
        if (newAccessToken == null)
        {
            Response.Cookies.Delete("refresh");
            return Unauthorized();
        }

        Response.Headers.Append("Authorization", $"Bearer {newAccessToken}");
        return Ok(new MessageResponse("token refreshed succsessfuly"));

    }
    [HttpGet("whoami")]
    [Authorize]
    public async Task<IActionResult> Whoami()
    {
        Guid? id = HttpContext.GetPayload()?.UserId;
        if (id == null) return Unauthorized();
        return Ok(await _authService.Whoami(id.Value));
    }
}
