using System.ComponentModel.DataAnnotations;

namespace App.Requests
{
    public class UserUpdatePasswordRequest
    {
        [Required]
        public required string Password { get; set; }

        [Required]
        public required string NewPassword { get; set; }
    }

    public class UserUpdateRequest
    {
        [Length(1, 60)]
        public string? Nickname { get; set; }

        [Url]
        public string? Avatar { get; set; }
    }

    public class UpdateUserRoleRequest
    {
        [Required]
        [Length(1, 60)]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Role { get; set; }
    }
}