using App.Core.Audit;
using App.Core.Jwt;
using App.Features.Users.UpdateProfile.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App.Features.Users.UpdateProfile;

[ApiController]
[Route("users")]
[Authorize(Policy = "MustBeUser")]
[Audit]
public class UpdateProfileController : ControllerBase
{
    private readonly UpdateProfileService _service;

    public UpdateProfileController(UpdateProfileService service)
    {
        _service = service;
    }
    [HttpPatch("password")]
    public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordRequest req)
    {
        Guid? id = HttpContext.GetPayload()?.UserId;
        if (id == null) return Unauthorized();
        return Ok(await _service.UpdateUserPasswordAsync(req, id.Value));
    }
    [HttpPatch("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest req)
    {
        Guid? id = HttpContext.GetPayload()?.UserId;
        if (id == null) return Unauthorized();
        return Ok(await _service.UpdateProfileAsync(req, id.Value));
    }

}