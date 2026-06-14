using System.ComponentModel.DataAnnotations;
using App.Core.Enums;

namespace App.Core.Entities;

public class Audit
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [StringLength(60)]
    public required string User { get; set; }

    [Required]
    public UserRole Role { get; set; }

    [Required]
    [StringLength(10)]
    public required string Method { get; set; }

    [Required]
    public required int StatusCode { get; set; }

    [Required]
    [StringLength(255)]
    public required string Url { get; set; }

    [Required]
    [StringLength(45)]
    public required string Ip { get; set; }

    [Required]
    public required string Body { get; set; }

    [Required]
    public DateTime Time { get; set; } = DateTime.UtcNow;

    [Required]
    public required long ProcessedMs { get; set; }
}