using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace App.Core.Jwt;

public static class JwtExtensions
{
    // MIDDLEWARE TO AUTHORIZE IN CONTROLLERS [Authorize]
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, JwtConfig config)
    {
        // Get secret from appsettings.json
        string? accessSecret = config.AccessSecret;
        if (string.IsNullOrEmpty(accessSecret)) throw new InvalidOperationException("JWT secret 'Jwt:AccessSecret' not found in configuration.");

        // Configure JWT Authentication
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = config.Issuer,
                ValidAudience = config.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(accessSecret)),
                ClockSkew = TimeSpan.Zero
            };
            options.Events = new JwtBearerEvents
            {
                OnTokenValidated = context =>
                {
                    var claimsPrincipal = context.Principal;
                    if (claimsPrincipal?.Identity is ClaimsIdentity identity)
                    {
                        var jwtService = context.HttpContext.RequestServices.GetRequiredService<JwtService>();
                        var payload = jwtService.JwtGetPayload(claimsPrincipal.Claims);
                        if (payload != null)
                            context.Principal = new JwtClaimsPrincipal(identity, payload);
                    }
                    return Task.CompletedTask;
                }
            };
        });

        // Authorization policies [Authorize(Policy = "MustBeAdmin")]
        services.AddAuthorization(options =>
        {
            options.AddPolicy("MustBeAdmin", policy => policy.RequireRole("Admin"));
            options.AddPolicy("MustBeUser", policy => policy.RequireRole("User", "Admin"));
        });

        return services;
    }

    public static JwtAccessPayload? GetPayload(this HttpContext context)
    {
        if (context.User?.Identity?.IsAuthenticated != true)
        {
            return null;
        }
        var jwtService = context.RequestServices.GetService<JwtService>();
        if (jwtService == null) return null;
        return jwtService.JwtGetPayload(context.User.Claims);
    }
}