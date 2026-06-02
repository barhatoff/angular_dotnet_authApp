namespace App.Models
{
    public interface IJwtSignPayload
    {
        string AccessToken { get; set; }
        string RefreshToken { get; set; }
    }
    public class JwtSignPayload : IJwtSignPayload
    {
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
    }
    public class JwtPayload
    {
        public required string Email { get; set; }
        public required string Nickname { get; set; }
        public required string Role { get; set; }
    }
    public interface JwtRefreshPayload
    {
        string SessionId { get; set; }
    }
}