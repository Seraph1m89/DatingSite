using System;
using System.Threading.Tasks;
using AutoMapper;
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
		private readonly IMapper _mapper;

		public AuthController(IAuthRepository authRepository,
							  ITokenService tokenService,
							  IMapper mapper)
		{
			_authRepository = authRepository;
			_tokenService = tokenService;
			_mapper = mapper;
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] UserRegisterDto userForRegisterDto)
		{
			if (string.IsNullOrWhiteSpace(userForRegisterDto.UserName))
			{
				userForRegisterDto.UserName = userForRegisterDto.UserName.ToLowerInvariant();
			}

			if (await _authRepository.UserExist(userForRegisterDto.UserName))
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
			var userToReturn = _mapper.Map<UserForListDto>(createdUser);
			return CreatedAtRoute("GetUser", new { contoller = "Users", id = userToReturn.Id}, userToReturn);
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
		{
			var dbUser = await _authRepository.Login(userLoginDto.UserName.ToLowerInvariant(), userLoginDto.Password);

			if(dbUser == null)
			{
				return Unauthorized();
			}

			var user = _mapper.Map<UserForListDto>(dbUser);

			var token = _tokenService.GenerateToken(dbUser.Id, dbUser.UserName);
			return Ok(new {token, user});
		}
	}
}