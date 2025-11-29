using App.DB;
using App.Models;
using App.Responses;
using Microsoft.EntityFrameworkCore;

namespace App.Services
{
    public interface IUserService
    {
        Task<bool> UpdateUserPasswordAsync(Requests.UserUpdatePasswordRequest request, string email);
        Task<bool> UpdateUserAsync(Requests.UserUpdateRequest request, string email);
        Task<bool> UpdateUserRoleAsync(Requests.UpdateUserRoleRequest request, string hostEmail);
        Task<bool> DeleteUserAsync(string email, string hostEmail);
        Task<PagginationResponse<UserDto>> GetUsers(int limit, int page, string order, string sortBy, string? searchParam);
    }
    public class UserService : IUserService
    {
        // Constructor
        private readonly AddDbContext _context;
        public UserService(AddDbContext context)
        {
            _context = context;
        }
        // Private methods
        private async Task<UserModel> GetUserByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email) ?? throw new KeyNotFoundException("User not found");
            return user;
        }

        // Public methods
        public async Task<bool> UpdateUserPasswordAsync(Requests.UserUpdatePasswordRequest request, string email)
        {
            var user = await GetUserByEmailAsync(email);

            // Verify current password
            bool isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!isValid) throw new UnauthorizedAccessException("Wrong password");

            string newPasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.PasswordHash = newPasswordHash;
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> UpdateUserAsync(Requests.UserUpdateRequest request, string email)
        {
            var user = await GetUserByEmailAsync(email);

            if (string.IsNullOrEmpty(request.Nickname) && string.IsNullOrEmpty(request.Avatar))
                throw new BadHttpRequestException("Nothing to update");

            if (!string.IsNullOrEmpty(request.Nickname))
                user.Nickname = request.Nickname;
            if (!string.IsNullOrEmpty(request.Avatar))
                user.Avatar = request.Avatar;

            await _context.SaveChangesAsync();
            return true;
        }

        // ROOT ONLY
        public async Task<bool> UpdateUserRoleAsync(Requests.UpdateUserRoleRequest request, string hostEmail)
        {
            var user = await GetUserByEmailAsync(request.Email);

            if (user.Email == hostEmail)
                throw new Exception("You cannot change your own role");
            if (!Enum.TryParse<Enums.UserRole>(request.Role, true, out var newRole))
                throw new Exception("Invalid role");

            user.Role = newRole;
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<bool> DeleteUserAsync(string email, string hostEmail)
        {
            var user = await GetUserByEmailAsync(email);

            if (user.Email == hostEmail)
                throw new Exception("You cannot delete your own account");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<PagginationResponse<UserDto>> GetUsers(int limit, int page, string order, string sortBy, string? searchParam)
        {
            List<string> allowedQuerySortBy = ["email", "nickname", "role"];
            IQueryable<UserModel> usersQuery = _context.Users;

            // 1. Search by searchParam
            if (!string.IsNullOrWhiteSpace(searchParam))
            {
                string normalizedParam = searchParam.ToLower();

                usersQuery = usersQuery.Where(u => u.Email.ToLower().Contains(normalizedParam) || u.Nickname.ToLower().Contains(normalizedParam));
            }

            // 2. Sorting by sortBy queary
            if (!allowedQuerySortBy.Contains(sortBy)) { throw new Exception("Bad query sortBy"); }

            bool isDescending = order.Equals("desc", StringComparison.OrdinalIgnoreCase);

            usersQuery = sortBy switch
            {
                "email" => isDescending ? usersQuery.OrderByDescending(u => u.Email) : usersQuery.OrderBy(u => u.Email),
                "nickname" => isDescending ? usersQuery.OrderByDescending(u => u.Nickname) : usersQuery.OrderBy(u => u.Nickname),
                "role" => isDescending ? usersQuery.OrderByDescending(u => u.Role) : usersQuery.OrderBy(u => u.Role),
                _ => usersQuery.OrderBy(u => u.Email)
            };

            // 3. Counting total before pagination
            int totalCount = await usersQuery.CountAsync();

            // 4. Pagination and limits
            if (page < 1) page = 1;
            if (limit < 1) limit = 30;
            int skipCount = (page - 1) * limit;
            usersQuery = usersQuery.Skip(skipCount);
            usersQuery = usersQuery.Take(limit);

            // 5. Counting total pages
            int totalPages = (int)Math.Ceiling((double)totalCount / limit);

            // 6. RESULT
            var userDtos = await usersQuery.Select(u => new UserDto
            {
                Email = u.Email,
                Nickname = u.Nickname,
                Role = u.Role.ToString(),
            }).ToListAsync();
            var result = new PagginationResponse<UserDto>
            {
                Data = userDtos,
                Total = totalCount,
                Page = page,
                Pages = totalPages
            };

            return result;
        }
    }
}