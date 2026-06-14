using App.Core.Audit;
using App.Core.Jwt;
using App.Features.Users.Administration.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App.Features.Users.Administration.Controllers;

[ApiController]
[Route("/admin/users")]
[Authorize(Policy = "MustBeAdmin")]
[Audit]
public class AdminUserController : ControllerBase
{
    private readonly AdminUserService _service;
    public AdminUserController(AdminUserService service)
    {
        _service = service;
    }

    [HttpGet()]
    public async Task<IActionResult> GetUsers([FromQuery] GetUsersQuery query)
    {
        return Ok(await _service.GetUsers(query));
    }
    [HttpPatch("{id:guid}/role")]
    public async Task<IActionResult> UpdateRole([FromBody] UpdateUserRoleRequest req, [FromRoute] Guid id)
    {
        Guid? hostId = HttpContext.GetPayload()?.UserId;
        if (hostId == null) return Unauthorized();
        return Ok(await _service.UpdateUserRoleAsync(id, req, hostId.Value));
    }
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteUser([FromRoute] Guid id)
    {
        Guid? hostId = HttpContext.GetPayload()?.UserId;
        if (hostId == null) return Unauthorized();
        await _service.DeleteUserAsync(id, hostId.Value);
        return NoContent();
    }
}