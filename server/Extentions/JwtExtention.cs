using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace App.Extentions
{
    public static class JwtExtentions
    {
        // MIDDLEWARE TO AUTHORIZE IN CONTROLLERS [Authorize]
        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            // Get secret from appsettings.json
            string? accessSecret = configuration["Jwt:AccessSecret"];
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
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidAudience = configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(accessSecret))
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
    }
}