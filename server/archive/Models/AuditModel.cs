using System.ComponentModel.DataAnnotations;

namespace App.Models
{
    public class AuditModel
    {
        [Key]
        [Required]
        public required string Time { get; set; }
        [Required]
        [Length(1, 60)]
        public required string User { get; set; }
        [Required]
        [Length(1, 20)]
        public required string Role { get; set; }
        [Required]
        [Length(1, 10)]
        public required string Method { get; set; }
        [Required]
        [Length(1, 200)]
        public required string Url { get; set; }
        [Required]
        [Length(1, 45)]
        public required string Ip { get; set; }
        [Required]
        public required string Body { get; set; }
    }

}