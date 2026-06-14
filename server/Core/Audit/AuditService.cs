using App.Core.Database;
using App.Shared.Extensions;
using App.Shared.Responses;
using Microsoft.EntityFrameworkCore;
using AuditEntity = App.Core.Entities.Audit;

namespace App.Core.Audit;

public class AuditService
{
    private readonly AppDbContext _db;

    public AuditService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<PaginationResponse<AuditEntity>> GetAuditsAsync(int limit, int page, string order, string? searchParam)
    {
        IQueryable<AuditEntity> auditsQuery = _db.Audits;

        // 1. Search by searchParam
        if (!string.IsNullOrWhiteSpace(searchParam))
        {
            string matchPattern = $"%{searchParam}%";
            auditsQuery = auditsQuery.Where(a =>
                EF.Functions.ILike(a.User, matchPattern) ||
                EF.Functions.ILike(a.Url, matchPattern) ||
                EF.Functions.ILike(a.Ip, matchPattern)
            );
        }
        // 2. Order
        bool isDescending = order.Equals("desc", StringComparison.OrdinalIgnoreCase);
        if (isDescending) auditsQuery = auditsQuery.OrderByDescending(a => a.Time);
        else auditsQuery = auditsQuery.OrderBy(a => a.Time);

        return await auditsQuery.ToPaginatedResponseAsync(page, limit);
    }
    public async Task<bool> CreateAuditAsync(AuditEntity audit)
    {
        _db.Audits.Add(audit);
        var result = await _db.SaveChangesAsync();
        return result > 0;
    }
}