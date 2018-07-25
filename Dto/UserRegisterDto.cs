using System;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dto
{
    public class UserRegisterDto
    {
        public UserRegisterDto()
        {
            LastActive = DateTime.UtcNow;
            Created = DateTime.UtcNow;
        }

        [Required]
        public string UserName { get; set; }

        [Required]
        [StringLength(24, MinimumLength=6, ErrorMessage="Please specify a password between {2} and {1}")]
        public string Password { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public string KnownAs { get; set; }

        [Required]
        public DateTime? DateOfBirth { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Country { get; set; }

        public DateTime LastActive { get; set; }

        public DateTime Created { get; set; }
    }
}