using App.Shared.DTOs;

namespace App.Features.Audits.Requests;

public class GetAuditsQuery : BaseFilterParams
{
    public GetAuditsQuery()
    {
        SortBy = "Date";
        Limit = 100;
    }
}