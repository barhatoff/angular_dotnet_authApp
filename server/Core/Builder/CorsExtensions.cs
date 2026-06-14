namespace App.Core.Builder;

public static class CorsExtensions
{
    public const string DevCorsPolicy = "_devCorsPolicy";

    public static IServiceCollection AddAppCors(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment)
    {
        var clientUrl = configuration["AppOptions:ClientUrl"];

        if (environment.IsProduction() && string.IsNullOrEmpty(clientUrl))
        {
            throw new InvalidOperationException("ClientUrl is not configured for Production!");
        }

        clientUrl ??= "http://localhost:4200";

        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins(clientUrl)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();

                policy.WithExposedHeaders("Authorization");
            });
        });

        return services;
    }

    public static IApplicationBuilder UseAppCors(this IApplicationBuilder app)
    {
        app.UseCors();
        return app;
    }

}