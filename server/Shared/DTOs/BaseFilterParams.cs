namespace App.Shared.DTOs;

public class BaseFilterParams
{
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 30;
    public string Order { get; set; } = "asc";
    public string SortBy { get; set; } = "Id";
    public string? SearchParam { get; set; } = null;
}