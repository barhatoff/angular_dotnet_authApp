using System.ComponentModel.DataAnnotations;

namespace App.Features.Users.Administration.Requests;

public class UpdateUserRoleRequest
{
    [Required]
    public required string Role { get; set; }
}