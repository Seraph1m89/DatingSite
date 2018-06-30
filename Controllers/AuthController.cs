using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dto;
using DatingApp.API.Models;
using DatingApp.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IAuthRepository _authRepository;
        private readonly ITokenService _tokenService;

        public AuthController(IAuthRepository authRepository,
                              ITokenService tokenService)
        {
            this._authRepository = authRepository;
            this._tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto userForRegisterDto)
        {
            userForRegisterDto.UserName = userForRegisterDto.UserName.ToLowerInvariant();

            if(await _authRepository.UserExist(userForRegisterDto.UserName))
            {
                ModelState.AddModelError("UserName", "Username already exist");
            }

            // TODO: Validate request
            if(!ModelState.IsValid) 
            {
                return BadRequest(ModelState);
            }

            var userToCreate = new User { UserName = userForRegisterDto.UserName };
            var createdUser = await _authRepository.Register(userToCreate, userForRegisterDto.Password);

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
        {
            var dbUser = await _authRepository.Login(userLoginDto.UserName.ToLowerInvariant(), userLoginDto.Password);

            if(dbUser == null)
            {
                return Unauthorized();
            }

            var token = _tokenService.GenerateToken(dbUser.Id, dbUser.UserName);
            return Ok(new {token});
        }
    }
}