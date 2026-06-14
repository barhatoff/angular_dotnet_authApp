using System.Security.Claims;

namespace App.Core.Jwt;

public class JwtClaimsPrincipal : ClaimsPrincipal
{
    public JwtAccessPayload Payload { get; }

    public JwtClaimsPrincipal(ClaimsIdentity identity, JwtAccessPayload payload)
        : base(identity)
    {
        Payload = payload;
    }
}