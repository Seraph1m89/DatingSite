using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Dto
{
    public class PhotoForCreationDto
    {
        public string Url { get; set; }

        [Required]
        public IFormFile File { get; set; }

        public string  Description { get; set; }

        public DateTime DateAdded { get; set; } = DateTime.Now;

        public string PublicId { get; set; }
    }
}
