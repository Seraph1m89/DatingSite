using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dto;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using DatingApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    public class PhotosController : Controller
    {
        private readonly IDatingRepository _repository;
        private readonly IMapper _mapper;
        private readonly ICloudinaryFactory _cloudinaryFactory;

        public PhotosController(IDatingRepository repository, IMapper mapper, ICloudinaryFactory cloudinaryFactory)
        {
            _repository = repository;
            _mapper = mapper;
            _cloudinaryFactory = cloudinaryFactory;
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repository.Get<Photo>(id);
            if (photoFromRepo == null)
            {
                return BadRequest();
            }

            var photo = _mapper.Map<PhotoToReturnDto>(photoFromRepo);
            return Ok(photo);
        }

        [HttpPost]
        [CurrentUser]
        public async Task<IActionResult> AddPhotoForUser(int userId, PhotoForCreationDto photoDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var user = await _repository.GetUser(userId);
            if (user == null)
            {
                return BadRequest("Could not find the user");
            }

            var uploadResults = _cloudinaryFactory.UploadImage(photoDto.File);

            photoDto.Url = uploadResults.Uri.ToString();
            photoDto.PublicId = uploadResults.PublicId;

            var photo = _mapper.Map<Photo>(photoDto);
            photo.User = user;

            if (!user.Photos.Any(p => p.IsMain))
            {
                photo.IsMain = true;
            }

            _repository.Add(photo);

            if (await _repository.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoToReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id }, photoToReturn);
            }

            return BadRequest("Could not add the photo");
        }

        [HttpPut("{photoId}/setMain")]
        [CurrentUser]
        public async Task<IActionResult> SetMainPhoto(int userId, int photoId)
        {
            var photoFromRepo =  await _repository.Get<Photo>(photoId);
            if (photoFromRepo == null)
            {
                return NotFound("Could not find photo");
            }

            if (photoFromRepo.IsMain)
            {
                return BadRequest("This is aleady the main photo");
            }

            var mainPhoto = (await _repository.FindBy<Photo>(p => p.IsMain && p.UserId == userId)).FirstOrDefault();
            if (mainPhoto != null)
            {
                mainPhoto.IsMain = false;
            }

            photoFromRepo.IsMain = true;
            if (await _repository.SaveAll())
            {
                return NoContent();
            }

            return BadRequest("Could not set photo as main");
        }
    }
}