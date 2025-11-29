using App.Models;
using App.DB;
using Microsoft.EntityFrameworkCore;
using App.Responses;

namespace App.Services
{
    public interface IAuditService
    {
        Task<PagginationResponse<AuditModel>> GetAuditsAsync(int limit, int page, string order, string? searchParam);
        Task<bool> CreateAuditAsync(AuditModel audit);
    }
    public class AuditService : IAuditService
    {
        // Constructor
        private readonly AddDbContext _context;
        public AuditService(AddDbContext context)
        {
            _context = context;
        }

        public async Task<PagginationResponse<AuditModel>> GetAuditsAsync(int limit, int page, string order, string? searchParam)
        {
            IQueryable<AuditModel> auditsQuery = _context.Audits;

            // 1. Search by searchParam
            if (!string.IsNullOrWhiteSpace(searchParam))
            {
                string normalizedParam = searchParam.ToLower();

                auditsQuery = auditsQuery.Where(a => a.Time.ToLower().Contains(normalizedParam) || a.User.ToLower().Contains(normalizedParam) || a.Url.ToLower().Contains(normalizedParam) || a.Ip.ToLower().Contains(normalizedParam));
            }
            // 2. Order
            bool isDescending = order.Equals("desc", StringComparison.OrdinalIgnoreCase);
            if (isDescending) auditsQuery = auditsQuery.OrderByDescending(a => a.Time);
            else auditsQuery = auditsQuery.OrderBy(a => a.Time);

            // 3. Counting total before pagination
            int totalCount = await auditsQuery.CountAsync();

            // 4. Pagination and limits
            if (page < 1) page = 1;
            if (limit < 1) limit = 100;
            int skipCount = (page - 1) * limit;
            auditsQuery = auditsQuery.Skip(skipCount);
            auditsQuery = auditsQuery.Take(limit);

            // 5. Counting total pages
            int totalPages = (int)Math.Ceiling((double)totalCount / limit);


            // 6. RESULT
            var auditsList = await auditsQuery.ToListAsync();
            var result = new PagginationResponse<AuditModel>
            {
                Data = auditsList,
                Total = totalCount,
                Page = page,
                Pages = totalPages
            };
            return result;
        }
        public async Task<bool> CreateAuditAsync(AuditModel audit)
        {
            _context.Audits.Add(audit);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }
    }
}