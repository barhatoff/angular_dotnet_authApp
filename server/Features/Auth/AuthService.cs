using App.Core.Database;
using App.Core.Enums;
using App.Core.Jwt;
using App.Features.Users;
using App.Shared.Responses;
using Microsoft.EntityFrameworkCore;
using UserEntities = App.Core.Entities.User;

namespace App.Features.Auth;

public class AuthService
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwt;

    public AuthService(AppDbContext context, JwtService jwtService)
    {
        _db = context ?? throw new ArgumentNullException(nameof(context));
        _jwt = jwtService;
    }

    public async Task<MessageResponse> RegisterAsync(Requests.RegisterRequest request)
    {
        var emailExists = await _db.Users.AnyAsync(u => u.Email == request.Email);
        if (emailExists) throw new BadHttpRequestException("This email already used");

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new UserEntities
        {
            Avatar = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
            Nickname = request.Nickname ?? request.Email.Split('@')[0],
            Email = request.Email,
            PasswordHash = passwordHash,
            Role = UserRole.Guest,
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return new MessageResponse("Registration successful");
    }
    public async Task<JwtTokenResult> LoginAsync(Requests.LoginRequest request, string IpAddress)
    {
        // Find user by email
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null) throw new UnauthorizedAccessException();

        // Verify password
        bool isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isValid) throw new UnauthorizedAccessException();

        // Sign JWT tokens
        var tokens = await _jwt.JwtSign(user, IpAddress);
        return tokens;
    }
    public async Task<UserSecureDto?> Whoami(Guid id)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) throw new UnauthorizedAccessException("invalid token");
        return user.ToSecureDto();
    }
}