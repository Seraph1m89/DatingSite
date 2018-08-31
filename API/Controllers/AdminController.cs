using System.Linq;
using System.Net;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Authorize(Policy = "RequireAdminRole")]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminRepository _repository;
        private readonly UserManager<User> _userManager;

        public AdminController(DataContext context, UserManager<User> userManager, IAdminRepository repository)
        {
            _userManager = userManager;
            _repository = repository;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("UsersWithRoles")]
        public async Task<IActionResult> GetUsersWithRoles()
        {
            var userList = await _repository.GetUsers();
            return Ok(userList);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("editRoles/{userName}")]
        public async Task<IActionResult> EditRoles(string userName, RoleEditDto roleEditDto)
        {
            var user = await _userManager.FindByNameAsync(userName);
            var userRoles = await _userManager.GetRolesAsync(user);
            var selectedRoles = roleEditDto.RoleNames ?? new string[] {};
            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
            if (!result.Succeeded)
                return BadRequest("Failed to add new roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
            if (!result.Succeeded)
                return BadRequest("Failed to remove user from roles");

            return Ok(await _userManager.GetRolesAsync(user));
        }
    }

    public class RoleEditDto
    {
        public string[] RoleNames { get; set; }
    }
}
