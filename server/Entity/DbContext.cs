using App.Enums;
using App.Models;
using Microsoft.EntityFrameworkCore;

namespace App.DB
{
    public class AddDbContext : DbContext
    {
        public AddDbContext(DbContextOptions<AddDbContext> options) : base(options) { }

        public DbSet<UserModel> Users
        {
            get; set;
        } = null!;
        public DbSet<RefreshTokenModel> RefreshTokens
        {
            get; set;
        } = null!;
        public DbSet<AuditModel> Audits
        {
            get; set;
        } = null!;

        // SET USER ROLE AS STRING
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserModel>()
                .Property(e => e.Role)
                .HasConversion(
                    v => v.ToString(),
                    v => (UserRole)Enum.Parse(typeof(UserRole), v));
        }
    }
}