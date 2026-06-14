using App.Core.Enums;

namespace App.Core.Jwt;

public record JwtTokenResult(string AccessToken, string RefreshToken);
public record JwtAccessPayload(
    Guid UserId,
    string Email,
    string Nickname,
    UserRole Role
);
public record JwtRefreshPayload(Guid SessionId);