using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dto;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetUsers();
            var usersDtos = _mapper.Map<IEnumerable<UserForListDto>>(users);

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

        [HttpPut("{id}")]
        [CurrentUser(UserIdParameter = "id")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserForUpdateDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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
    }
}
