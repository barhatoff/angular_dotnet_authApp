using App.DB;
using App.Services;
using App.Extentions;
using Microsoft.EntityFrameworkCore;
using App.Constants;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(Main.AppUrl).AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials().WithExposedHeaders("Authorization");
    });
});
builder.Services.AddDbContext<AddDbContext>(options => options.UseNpgsql
(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllers();
builder.Services.AddAppServices();
builder.Services.AddJwtAuthentication(builder.Configuration);

var app = builder.Build();
if (app.Environment.IsDevelopment())
    app.MapOpenApi();


app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGet("/", () => Results.Json(new { message = "API is running..." }));
app.MapFallback(() => Results.NotFound(new { message = "API: Route not found" }));

app.Run();


