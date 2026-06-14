using System.ComponentModel.DataAnnotations;

namespace App.Features.Users.UpdateProfile.Requests;

public class UpdatePasswordRequest
{
    [Required]
    [StringLength(60, MinimumLength = 6)]
    public required string Password { get; set; }

    [Required]
    [StringLength(60, MinimumLength = 6)]
    public required string NewPassword { get; set; }
}