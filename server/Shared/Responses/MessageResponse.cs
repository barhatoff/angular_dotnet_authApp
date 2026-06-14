namespace App.Shared.Responses;

using System.Diagnostics.CodeAnalysis;

public class MessageResponse
{
    public required string Message { get; set; }

    public MessageResponse() { }

    [SetsRequiredMembers]
    public MessageResponse(string message)
    {
        Message = message;
    }
}