using AuditEntity = App.Core.Entities.Audit;

namespace App.Core.Audit;

public class AuditLogger
{
    public void printLog(AuditEntity audit)
    {
        Console.ForegroundColor = ConsoleColor.Green;
        Console.Write("[AUDIT] ");

        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.Write($"USER: {audit.User} | ROLE: {audit.Role} | IP: {audit.Ip}");

        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.Write($" {audit.Method} {audit.Url} ");

        Console.ForegroundColor = returnStatusCodeColor(audit.StatusCode);
        Console.Write($"{audit.StatusCode} ");

        Console.ForegroundColor = ConsoleColor.Green;
        Console.Write($"[{audit.ProcessedMs}ms]");

        Console.ResetColor();

        // optional
        // Console.WriteLine(audit.Body); 
    }

    private System.ConsoleColor returnStatusCodeColor(int statusCode)
    {
        char statusCodeGroup = statusCode.ToString()[0];
        if (statusCodeGroup == '2') return ConsoleColor.Green;
        else if (statusCodeGroup == '3') return ConsoleColor.Yellow;
        else return ConsoleColor.Red;
    }
}