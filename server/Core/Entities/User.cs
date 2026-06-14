using System.ComponentModel.DataAnnotations;
using App.Core.Enums;

namespace App.Core.Entities;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [StringLength(60)]
    [EmailAddress]
    public required string Email { get; set; }
    [Required]
    public required string PasswordHash { get; set; }
    [Required]
    [StringLength(60)]
    public required string Nickname { get; set; }
    [Url]
    public required string Avatar { get; set; }
    [Required]
    public UserRole Role { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}