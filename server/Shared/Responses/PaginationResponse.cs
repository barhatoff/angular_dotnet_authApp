namespace App.Shared.Responses;

public class PaginationResponse<T>
{
    public IReadOnlyCollection<T> Data { get; set; } = Array.Empty<T>();
    public int Total { get; set; }
    public int Page { get; set; }
    public int Pages { get; set; }

}