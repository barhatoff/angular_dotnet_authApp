using App.Core.Audit;
using App.Features.Audits.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App.Features.Audits;

[ApiController]
[Route("admin/audits")]
[Audit]
[Authorize(Policy = "MustBeAdmin")]
public class AuditsController : ControllerBase
{
    private readonly AuditService _service;
    public AuditsController(AuditService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAudits([FromQuery] GetAuditsQuery query)
    {
        return Ok(await _service.GetAuditsAsync(query.Limit, query.Page, query.Order, query.SearchParam));
    }
}