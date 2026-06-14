using App.Core.Database;
using App.Core.Enums;
using App.Features.Users.Administration.Requests;
using App.Shared.Extensions;
using App.Shared.Responses;
using Microsoft.EntityFrameworkCore;
using UserEntities = App.Core.Entities.User;

namespace App.Features.Users.Administration;

public class AdminUserService
{
    private readonly AppDbContext _db;
    public AdminUserService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<UserSecureDto> UpdateUserRoleAsync(Guid id, UpdateUserRoleRequest request, Guid hostId)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) throw new KeyNotFoundException("User not found");

        if (user.Id == hostId)
            throw new BadHttpRequestException("You cannot change your own role");
        if (!Enum.TryParse<UserRole>(request.Role, true, out var newRole))
            throw new BadHttpRequestException("Invalid role");

        user.Role = newRole;

        await _db.SaveChangesAsync();
        return user.ToSecureDto();
    }
    public async Task<MessageResponse> DeleteUserAsync(Guid id, Guid hostId)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) throw new KeyNotFoundException("User not found");
        if (user.Id == hostId)
            throw new BadHttpRequestException("You cannot delete your own account");

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();

        return new MessageResponse($"User {id} successfully deleted");
    }
    public async Task<PaginationResponse<UserMinimazedDto>> GetUsers(GetUsersQuery queryParam)
    {
        List<string> allowedQuerySortBy = ["email", "nickname", "role"];
        IQueryable<UserEntities> usersQuery = _db.Users;

        // 1. Search by searchParam
        if (!string.IsNullOrWhiteSpace(queryParam.SearchParam))
        {
            string matchPattern = $"%{queryParam.SearchParam}%";
            usersQuery = usersQuery.Where(u =>
              EF.Functions.ILike(u.Email, matchPattern) ||
                EF.Functions.ILike(u.Nickname, matchPattern)
            );
        }

        // 2. Sorting by sortBy query
        if (!allowedQuerySortBy.Contains(queryParam.SortBy)) { throw new BadHttpRequestException("Bad query sortBy"); }
        bool isDescending = queryParam.Order.Equals("desc", StringComparison.OrdinalIgnoreCase);

        usersQuery = queryParam.SortBy switch
        {
            "email" => isDescending ? usersQuery.OrderByDescending(u => u.Email) : usersQuery.OrderBy(u => u.Email),
            "nickname" => isDescending ? usersQuery.OrderByDescending(u => u.Nickname) : usersQuery.OrderBy(u => u.Nickname),
            "role" => isDescending ? usersQuery.OrderByDescending(u => u.Role) : usersQuery.OrderBy(u => u.Role),
            _ => usersQuery.OrderBy(u => u.Email)
        };

        var query = usersQuery.Select(u => new UserMinimazedDto
        {
            Id = u.Id,
            Email = u.Email,
            Nickname = u.Nickname,
            Role = u.Role.ToString()
        });
        return await query.ToPaginatedResponseAsync(queryParam.Page, queryParam.Limit);
    }
}