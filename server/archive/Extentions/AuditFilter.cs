using App.Models;
using App.Services;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Filters;

namespace App.Extentions
{
    public class Audit : ActionFilterAttribute
    {
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // Dependency Injection
            var auditService = context.HttpContext.RequestServices.GetService<IAuditService>();
            if (auditService == null) { await next(); return; }

            // Creating audit log <AuditModel>
            string Url = context.HttpContext.Request.Path;
            string Body = JsonSerializer.Serialize(context.ActionArguments);
            // Hide sensitive info
            if (Url == "/auth/login" || Url == "/auth/register")
                Body = "{\"info\": \"sensitive info omitted\"}";

            var audit = new AuditModel
            {
                Time = DateTime.UtcNow.ToString("o"),
                User = context.HttpContext.User.FindFirst(ClaimTypes.Email)?.Value ?? "anonymous",
                Role = context.HttpContext.User.FindFirst(ClaimTypes.Role)?.Value ?? "none",
                Method = context.HttpContext.Request.Method,
                Url = Url,
                Ip = context.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown ip",
                Body = Body
            };

            // Console logging
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("[AUDIT] ");

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.Write($"USER: {audit.User} | ROLE: {audit.Role} | IP: {audit.Ip}");

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.Write($" {audit.Method} {audit.Url} ");

            Console.ResetColor();
            Console.WriteLine(audit.Body);

            // Save audit log to DB
            await auditService.CreateAuditAsync(audit);
            await next();
        }
    }
}