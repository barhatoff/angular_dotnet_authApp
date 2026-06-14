using System.ComponentModel.DataAnnotations;

namespace App.Features.Auth.Requests;

public class RegisterRequest
{
    [Required]
    [StringLength(60, MinimumLength = 5)]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public required string Password { get; set; }

    [Required]
    [StringLength(60, MinimumLength = 3)]
    public required string Nickname { get; set; }
}
