using System.ComponentModel.DataAnnotations;

namespace App.Features.Users.UpdateProfile.Requests;

public class UpdateProfileRequest
{
    [StringLength(60, MinimumLength = 3)]
    public string? Nickname { get; set; }

    [Url]
    public string? Avatar { get; set; }
}

