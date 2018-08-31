using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dto;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivityFilter))]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] UserQueryParams userQueryParams)
        {
            var currentUserId = User.GetId();
            userQueryParams.CurrentUserId = currentUserId;

            if (string.IsNullOrWhiteSpace(userQueryParams.Gender))
            {
                var currentUser = await _repo.GetUser(currentUserId);
                userQueryParams.Gender = currentUser.Gender.Equals("male", StringComparison.InvariantCultureIgnoreCase)
                    ? "female"
                    : "male";
            }

            var users = await _repo.GetUsers(userQueryParams);
            var usersDtos = _mapper.Map<IEnumerable<UserForListDto>>(users);

            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(usersDtos);
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            if (user == null)
            {
                return NotFound();
            }

            var userDto = _mapper.Map<UserDetailsDto>(user);

            return Ok(userDto);
        }

        [HttpGet("GetLikes")]
        public async Task<IActionResult> GetLikes([FromQuery] LikesQueryParams likesQueryParams)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            likesQueryParams.CurrentUserId = currentUserId;

            var users = await _repo.GetUsers(likesQueryParams);
            var usersDtos = _mapper.Map<IEnumerable<UserForListDto>>(users);

            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(usersDtos);
        }

        [HttpPut("{id}")]
        [CurrentUser(UserIdParameter = "id")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserForUpdateDto userDto)
        {
            var userFromRepo = await _repo.GetUser(id);

            if (userFromRepo == null)
            {
                return NotFound($"Could not find user with ID {id}");
            }

            _mapper.Map(userDto, userFromRepo);
            if (await _repo.SaveAll())
            {
                return Ok();
            }

            throw new Exception($"Updating user {id} failed on save");
        }

        [HttpPost("{id}/like/{recipientId}")]
        [CurrentUser(UserIdParameter = "id")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            var like = await _repo.GetLike(id, recipientId);

            if (like != null)
                return BadRequest("You already liked this user");

            if (await _repo.GetUser(recipientId) == null)
                return NotFound();

            like = new Like
            {
                LikerId = id,
                LikeeId = recipientId
            };

            _repo.Add(like);

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("Failed to like user");
        } 

    }
}
