namespace App.Features.Users;

public static class UserMappingExtensions
{
    public static UserSecureDto ToSecureDto(this Core.Entities.User user)
    {
        return new UserSecureDto
        {
            Id = user.Id,
            Email = user.Email,
            Nickname = user.Nickname,
            Avatar = user.Avatar,
            Role = user.Role.ToString()
        };
    }
    public static UserMinimazedDto ToMinimizedDto(this Core.Entities.User user)
    {
        return new UserMinimazedDto
        {
            Id = user.Id,
            Email = user.Email,
            Nickname = user.Nickname,
            Role = user.Avatar,
        };
    }
}