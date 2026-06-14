using App.Shared.DTOs;

namespace App.Features.Users.Administration.Requests;


public class GetUsersQuery : BaseFilterParams
{
    public GetUsersQuery()
    {
        SortBy = "Email";
    }
}