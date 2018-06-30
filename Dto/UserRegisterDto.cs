using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dto
{
    public class UserRegisterDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        [StringLength(24, MinimumLength=6, ErrorMessage="Please specify a password between {2} and {1}")]
        public string Password { get; set; }
    }
}