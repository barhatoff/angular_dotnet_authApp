namespace App.Core.Jwt;

public class JwtConfig
{
    public required string AccessSecret { get; set; }
    public int AccessTokenLifetimeH { get; set; }
    public required string RefreshSecret { get; set; }
    public int RefreshTokenLifetimeH { get; set; }
    public required string Issuer { get; set; }
    public required string Audience { get; set; }

}