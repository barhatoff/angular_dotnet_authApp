using App.Models;
using App.DB;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace App.Services
{
    public interface IAuthService
    {
        Task<UserModel> RegisterAsync(Requests.AuthRegisterRequest request);
        Task<IJwtSignPayload> LoginAsync(Requests.AuthLoginRequest request, string IpAddress);
        Task<UserSecureDto?> Whoim(IEnumerable<Claim> claims);
    }
    public class AuthService : IAuthService
    {
        private readonly AddDbContext _context;
        private readonly IJwtService _jwtService;
        public AuthService(AddDbContext context, IJwtService jwtService)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _jwtService = jwtService;
        }


        public async Task<UserModel> RegisterAsync(Requests.AuthRegisterRequest request)
        {
            var isEmailUnique = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (isEmailUnique != null) throw new Exception("This email already used");

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new UserModel
            {
                Avatar = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
                Nickname = request.Nickname ?? request.Email.Split('@')[0],
                Email = request.Email,
                PasswordHash = passwordHash,
                Role = Enums.UserRole.User
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }
        public async Task<IJwtSignPayload> LoginAsync(Requests.AuthLoginRequest request, string IpAddress)
        {
            // Find user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null) throw new Exception("User not found");

            // Verify password
            bool isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash); ;
            if (!isValid) throw new Exception("Invalid password");

            // Sign JWT tokens
            var tokens = await _jwtService.JwtSign(user, IpAddress);
            return tokens;
        }
        public async Task<UserSecureDto?> Whoim(IEnumerable<Claim> claims)
        {
            var email = _jwtService.JwtGetPayload(claims)?.Email;
            if (email == null) throw new Exception("Email claim not found");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) throw new Exception("User not found");

            return new UserSecureDto
            {
                Email = user.Email,
                Nickname = user.Nickname,
                Avatar = user.Avatar,
                Role = user.Role.ToString()
            };
        }
    }
}