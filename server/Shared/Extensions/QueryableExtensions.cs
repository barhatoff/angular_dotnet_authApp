using App.Shared.Responses;
using Microsoft.EntityFrameworkCore;

namespace App.Shared.Extensions;

public static class QueryableExtensions
{
    public static async Task<PaginationResponse<T>> ToPaginatedResponseAsync<T>(
        this IQueryable<T> query,
        int page,
        int limit)
    {
        // Pagination and limits
        if (page < 1) page = 1;
        if (limit < 1) limit = 100;

        int totalCount = await query.CountAsync();
        int totalPages = (int)Math.Ceiling((double)totalCount / limit);

        int skipCount = (page - 1) * limit;
        var data = await query.Skip(skipCount).Take(limit).ToListAsync();

        return new PaginationResponse<T>
        {
            Data = data,
            Total = totalCount,
            Page = page,
            Pages = totalPages
        };
    }
}