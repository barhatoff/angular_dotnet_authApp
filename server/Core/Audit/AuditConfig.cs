namespace App.Core.Audit;

public class AuditConfig
{
    private readonly List<string> _sensitiveRoutes = ["/auth/login", "/auth/register"];
    public IReadOnlyList<string> SensitiveRoutes => _sensitiveRoutes;
}