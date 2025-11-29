using System.ComponentModel.DataAnnotations;

namespace App.Requests
{
    public class AuthRegisterRequest
    {
        [Required]
        [Length(1, 60)]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [Length(6, 100)]
        public required string Password { get; set; }

        [Required]
        [Length(1, 60)]
        public required string Nickname { get; set; }
    }

    public class AuthLoginRequest
    {
        [Required]
        [Length(1, 60)]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [Length(6, 100)]
        public required string Password { get; set; }
    }
}