using App.Core.Entities;
using App.Core.Enums;
using Microsoft.EntityFrameworkCore;
using AuditEntity = App.Core.Entities.Audit;

namespace App.Core.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }


    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<AuditEntity> Audits => Set<AuditEntity>();

    // SET UserRole enum AS STRING
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .Property(e => e.Role)
            .HasConversion(
                v => v.ToString(),
                v => (UserRole)Enum.Parse(typeof(UserRole), v));
        modelBuilder.Entity<AuditEntity>()
            .Property(e => e.Role)
            .HasConversion(
                v => v.ToString(),
                v => (UserRole)Enum.Parse(typeof(UserRole), v));
    }
}