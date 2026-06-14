using App.Core.Audit;
using App.Core.Builder;
using App.Core.Config;
using App.Core.Database;
using App.Core.Jwt;
using App.Features.Auth;
using App.Features.Users.Administration;
using App.Features.Users.UpdateProfile;
using App.Infrastructure;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    DotNetEnv.Env.Load(".env.dev");
    builder.Configuration.AddEnvironmentVariables();
}
else
{
    DotNetEnv.Env.Load();
}

// OPTIONS CONFIGURATION
builder.Services.Configure<AppOptions>(builder.Configuration.GetSection("AppOptions"));
builder.Services.Configure<JwtConfig>(builder.Configuration.GetSection("Jwt"));

// OPENAPI
builder.Services.AddOpenApi();

// CORS
builder.Services.AddAppCors(builder.Configuration, builder.Environment);

// Database Postgresql
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql
(builder.Configuration.GetConnectionString("Database")));

// Scoped DI for JWT
var jwtConfig = builder.Configuration.GetSection("Jwt").Get<JwtConfig>() ?? throw new InvalidOperationException("Jwt configuration is missing!");
builder.Services.AddSingleton(jwtConfig);
builder.Services.AddScoped<JwtService>();
builder.Services.AddJwtAuthentication(jwtConfig);

// Audit
builder.Services.AddScoped<AuditService>();
builder.Services.AddSingleton<AuditLogger>();
builder.Services.AddSingleton(new AuditConfig());

// Features
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<AdminUserService>();
builder.Services.AddScoped<UpdateProfileService>();

// Controllers | Prefix /api
builder.Services.AddControllers(options =>
{
    options.Conventions.Add(new GlobalRoutePrefixConvention("api"));
});


var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseAppCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallback(() => Results.NotFound(new { message = "API: Route not found" }));

app.Run();