using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    class AdminRepository : IAdminRepository
    {
        private readonly DataContext _context;

        public AdminRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<IList<RoledUser>> GetUsers()
        {
            var userList = await (from user in _context.Users
                orderby user.UserName
                select new RoledUser
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Roles = (from userRole in user.UserRoles
                        join role in _context.Roles on userRole.RoleId equals role.Id
                        select role.Name).ToList()
                }).ToListAsync();

            return userList;
        }
    }
}