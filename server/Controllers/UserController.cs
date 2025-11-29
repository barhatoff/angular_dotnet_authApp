using App.Services;
using App.Requests;
using App.Extentions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace App.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    public class UserController : ControllerBase
    {
        // Dependency Injection
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;
        public UserController(IUserService userService, IJwtService jwtService)
        {
            _userService = userService;
            _jwtService = jwtService;
        }

        // ROUTES
        // User routes only
        [HttpPatch("password")]
        [Authorize(Policy = "MustBeUser")]
        public async Task<IActionResult> UpdatePassword([FromBody] UserUpdatePasswordRequest request)
        {
            try
            {
                Models.JwtPayload? payload = _jwtService.JwtGetPayload(User.Claims);
                if (payload == null) return Unauthorized();
                var user = await _userService.UpdateUserPasswordAsync(request, payload.Email);
                return Ok(new { message = "Password updated successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPatch("profile")]
        [Authorize(Policy = "MustBeUser")]
        [Audit]
        public async Task<IActionResult> UpdateProfile([FromBody] UserUpdateRequest request)
        {
            try
            {
                Models.JwtPayload? payload = _jwtService.JwtGetPayload(User.Claims);
                if (payload == null) return Unauthorized();
                var user = await _userService.UpdateUserAsync(request, payload.Email);
                return Ok(new { message = "Updated successfuly" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Admin routes only
        [HttpPatch("role")]
        [Authorize(Policy = "MustBeAdmin")]
        [Audit]
        public async Task<IActionResult> UpdateUserRole([FromBody] UpdateUserRoleRequest request)
        {
            try
            {
                string hostEmail = _jwtService.JwtGetPayload(User.Claims)?.Email ?? throw new Exception("Host email not found");

                var result = await _userService.UpdateUserRoleAsync(request, hostEmail);
                return Ok(new { message = $"User [{request.Email}] role updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet]
        [Authorize(Policy = "MustBeAdmin")]
        [Audit]
        public async Task<IActionResult> GetUsers([FromQuery] int limit = 30, [FromQuery] int page = 1, [FromQuery] string order = "asc", [FromQuery] string sortBy = "email", [FromQuery] string? searchParam = null)
        {
            try
            {
                var result = await _userService.GetUsers(limit, page, order, sortBy, searchParam);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpDelete]
        [Authorize(Policy = "MustBeAdmin")]
        [Audit]
        public async Task<IActionResult> DeleteUser([FromQuery] string email)
        {
            try
            {
                var hostEmail = _jwtService.JwtGetPayload(User.Claims)?.Email ?? throw new Exception("Host email not found");
                var result = await _userService.DeleteUserAsync(email, hostEmail);
                return Ok(new { message = $"User [{email}] deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}