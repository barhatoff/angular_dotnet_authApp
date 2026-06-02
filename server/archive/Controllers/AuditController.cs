using App.Services;
using App.Extentions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace App.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    public class AuditController : ControllerBase
    {
        // Dependency Injection
        private readonly IAuditService _auditService;
        public AuditController(IAuditService auditService)
        {
            _auditService = auditService;
        }

        // ROUTES - admin only
        // GET: /Audit
        [HttpGet]
        [Authorize(policy: "MustBeAdmin")]
        [Audit]
        public async Task<IActionResult> GetAudits([FromQuery] int limit = 100, [FromQuery] int page = 1, [FromQuery] string order = "desc", [FromQuery] string? searchParam = null)
        {
            try
            {
                var audits = await _auditService.GetAuditsAsync(limit, page, order, searchParam);
                return Ok(audits);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}