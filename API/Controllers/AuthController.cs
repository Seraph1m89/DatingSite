using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Dto;
using DatingApp.API.Models;
using DatingApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AuthController(ITokenService tokenService,
                              IMapper mapper,
                              UserManager<User> userManager,
                              SignInManager<User> signInManager)
        {
            _tokenService = tokenService;
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto userForRegisterDto)
        {
            var userToCreate = _mapper.Map<User>(userForRegisterDto);
            var result = await _userManager.CreateAsync(userToCreate, userForRegisterDto.Password);
            var userToReturn = _mapper.Map<UserDetailsDto>(userToCreate);
            if (result.Succeeded)
            {
                return CreatedAtRoute("GetUser", new { contoller = "Users", id = userToReturn.Id }, userToReturn);
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            var dbUser = await _userManager.FindByNameAsync(userLoginDto.UserName);
            var result = await _signInManager.CheckPasswordSignInAsync(dbUser, userLoginDto.Password, false);

            if (!result.Succeeded)
                return Unauthorized();

            var appUser = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(u => u.NormalizedUserName == userLoginDto.UserName.ToUpper());
            var userToReturn = _mapper.Map<UserForListDto>(appUser);
            var token = await _tokenService.GenerateToken(dbUser);

            return Ok(new {token, user = userToReturn});
        }
    }
}