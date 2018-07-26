using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dto;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivityFilter))]
    [Authorize]
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
        public async Task<IActionResult> GetUsers(int pageNumber = 1, int pageSize = 10)
        {
            var users = await _repo.GetUsers(pageNumber, pageSize);
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
    }
}
