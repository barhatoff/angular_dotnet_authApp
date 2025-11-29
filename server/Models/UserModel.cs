using App.Enums;
using System.ComponentModel.DataAnnotations;

namespace App.Models
{
    public class UserModel
    {
        [Key]
        [Required]
        [Length(1, 60)]
        [EmailAddress]
        public required string Email { get; set; }
        [Required]
        public required string PasswordHash { get; set; }
        [Required]
        [Length(1, 60)]
        public required string Nickname { get; set; }
        [Url]
        public required string Avatar { get; set; }
        [Required]
        public UserRole Role { get; set; }


    }
    public class UserDto
    {
        public required string Email { get; set; }
        public required string Nickname { get; set; }
        public required string Role { get; set; }
    }
    public class UserSecureDto
    {
        public required string Email { get; set; }
        public required string Nickname { get; set; }
        public required string Avatar { get; set; }
        public required string Role { get; set; }
    }
}