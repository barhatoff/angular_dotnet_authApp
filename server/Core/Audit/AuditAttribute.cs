using System.Text.Json;
using App.Core.Enums;
using App.Core.Jwt;
using Microsoft.AspNetCore.Mvc.Filters;
using AuditEntity = App.Core.Entities.Audit;

namespace App.Core.Audit;

public class AuditAttribute : ActionFilterAttribute
{
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var startTime = DateTime.UtcNow;

        // Get request data
        string Url = context.HttpContext.Request.Path;
        string Body = JsonSerializer.Serialize(context.ActionArguments);

        // Dependency Injection
        var auditService = context.HttpContext.RequestServices.GetService<AuditService>();
        var auditConfig = context.HttpContext.RequestServices.GetService<AuditConfig>();
        var auditLogger = context.HttpContext.RequestServices.GetService<AuditLogger>();

        // Hide sensitive info
        if (auditConfig != null && auditConfig.SensitiveRoutes.Any(route => Url.Contains(route, StringComparison.OrdinalIgnoreCase)))
            Body = "{\"info\": \"sensitive info omitted\"}";

        // Step request -> wait to response
        ActionExecutedContext executedContext = await next();

        // Response
        int statusCode = context.HttpContext.Response.StatusCode;
        var responseTime = DateTime.UtcNow;

        // Recheck for not proccesed exteptions
        if (executedContext.Exception != null)
        {
            statusCode = executedContext.Exception switch
            {
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                ArgumentException => StatusCodes.Status400BadRequest,
                KeyNotFoundException => StatusCodes.Status404NotFound,
                BadHttpRequestException badRequestEx => badRequestEx.StatusCode,
                _ => StatusCodes.Status500InternalServerError
            };
        }

        // Safely get user data
        var userPayload = context.HttpContext.GetPayload();
        string userEmail = userPayload?.Email ?? "anonymous";
        UserRole role = userPayload?.Role ?? UserRole.Guest;

        long processedMs = (long)(responseTime - startTime).TotalMilliseconds;

        var audit = new AuditEntity
        {
            Time = startTime,
            User = userEmail,
            Role = role,
            Method = context.HttpContext.Request.Method,
            Url = Url,
            Ip = context.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown ip",
            Body = Body,
            StatusCode = statusCode,
            ProcessedMs = processedMs
        };

        if (auditLogger != null) auditLogger.printLog(audit);
        if (auditService != null) await auditService.CreateAuditAsync(audit);
    }

}