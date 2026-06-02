using App.Services;
using App.Models;
using App.Extentions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using App.Constants;


namespace App.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IJwtService _jwtService;
        public AuthController(IAuthService authService, IJwtService jwtService)
        {
            _authService = authService;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        [Audit]
        public async Task<IActionResult> Register([FromBody] Requests.AuthRegisterRequest request)
        {
            try
            {
                var user = await _authService.RegisterAsync(request);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        [Audit]
        public async Task<IActionResult> Login([FromBody] Requests.AuthLoginRequest request)
        {
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown ip";
                var tokens = await _authService.LoginAsync(request, ipAddress);
                Response.Headers.Append("Authorization", $"Bearer {tokens.AccessToken}");
                Response.Cookies.Append("refresh", tokens.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTime.UtcNow.AddHours(Main.RefreshTokenLifetimeH),
                    SameSite = SameSiteMode.None, // DEV COMPROMISE
                    Secure = true
                });
                return Ok(new { message = "Login successful" });
            }
            catch
            {
                return Unauthorized(new { message = "wrong password or email" });
            }
        }
        [HttpDelete("logout")]
        [Authorize]
        [Audit]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var refreshToken = Request.Cookies["refresh"];
                if (string.IsNullOrEmpty(refreshToken))
                    return Unauthorized(new { message = "Refresh token is missing" });
                await _jwtService.RevokeRefreshToken(refreshToken);
                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpDelete("revoke-sessions")]
        [Authorize]
        [Audit]
        public async Task<IActionResult> LogoutEachSession()
        {
            try
            {
                JwtPayload? payload = _jwtService.JwtGetPayload(User.Claims);
                if (payload == null) return Unauthorized();
                await _jwtService.RevokeAllSessions(payload.Email);
                return Ok(new { message = "All user sessions was revoked" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            try
            {
                var refreshToken = Request.Cookies["refresh"];
                if (string.IsNullOrEmpty(refreshToken))
                    return Unauthorized();

                string newAccessToken = await _jwtService.JwtRefreshSign(refreshToken);
                if (newAccessToken == null)
                    return Unauthorized();

                Response.Headers.Append("Authorization", $"Bearer {newAccessToken}");
                return Ok(new { message = "token refreshed succsessfuly" });
            }
            catch
            {
                return Unauthorized();
            }
        }
        [HttpGet("whoim")]
        [Authorize]
        public async Task<IActionResult> Whoim()
        {
            try
            {
                UserSecureDto? user = await _authService.Whoim(User.Claims);
                if (user == null) return Unauthorized();
                return Ok(user);
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }
    }
}