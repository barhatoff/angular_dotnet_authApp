using App.Core.Database;
using App.Core.Entities;
using App.Features.Users.UpdateProfile.Requests;
using App.Shared.Responses;

namespace App.Features.Users.UpdateProfile;

public class UpdateProfileService
{
    private readonly AppDbContext _db;
    public UpdateProfileService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<MessageResponse> UpdateUserPasswordAsync(UpdatePasswordRequest req, Guid id)
    {
        var user = await GetUserByIdAsync(id);

        bool isValid = BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash);
        if (!isValid) throw new BadHttpRequestException("Wrong password");

        string newPasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
        user.PasswordHash = newPasswordHash;
        await _db.SaveChangesAsync();

        return new MessageResponse("Password successfully changed");
    }
    public async Task<UserSecureDto> UpdateProfileAsync(UpdateProfileRequest req, Guid id)
    {
        var user = await GetUserByIdAsync(id);
        var nickname = req.Nickname;
        var avatar = req.Avatar;

        if (string.IsNullOrEmpty(nickname) && string.IsNullOrEmpty(avatar))
            throw new BadHttpRequestException("Nothing to update");

        if (!string.IsNullOrEmpty(nickname))
            user.Nickname = nickname;
        if (!string.IsNullOrEmpty(avatar))
            user.Avatar = avatar;

        await _db.SaveChangesAsync();
        return user.ToSecureDto();
    }

    // private methods
    private async Task<User> GetUserByIdAsync(Guid id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) throw new KeyNotFoundException("User not found");
        return user;
    }
}