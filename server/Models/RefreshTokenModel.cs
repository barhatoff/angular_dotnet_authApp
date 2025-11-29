using System.ComponentModel.DataAnnotations;

namespace App.Models
{
    public class RefreshTokenModel
    {
        [Key]
        [Required]
        public required string SessionId { get; set; }
        [Required]
        public required string TokenHash { get; set; }
        [Required]
        public required string IpAddress { get; set; }
        [Required]
        public DateTime Expires { get; set; }
        [Required]
        public required DateTime Created { get; set; }
        public DateTime? Revoked { get; set; }
        [Required]
        public required string Email { get; set; }
    }
}