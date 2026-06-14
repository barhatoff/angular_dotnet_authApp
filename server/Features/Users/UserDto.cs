namespace App.Features.Users;

public class UserMinimazedDto
{
    public required Guid Id { get; set; }
    public required string Email { get; set; }
    public required string Nickname { get; set; }
    public required string Role { get; set; }
}
public class UserSecureDto
{
    public required Guid Id { get; set; }
    public required string Email { get; set; }
    public required string Nickname { get; set; }
    public required string Avatar { get; set; }
    public required string Role { get; set; }
}