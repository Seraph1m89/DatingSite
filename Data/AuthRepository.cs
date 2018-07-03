using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        private readonly IPasswordService _passwordService;

        public AuthRepository(DataContext context, IPasswordService passwordService)
        {
            this._context = context;
            _passwordService = passwordService;
        }

        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if(user == null) 
            {
                return null;
            }

            if(!_passwordService.VerifyPassword(password, user.PasswordHash, user.Salt))
            {
                return null;
            }

            return user;
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            _passwordService.CreatePasswordHash(password, out passwordHash, out passwordSalt);
            user.PasswordHash = passwordHash;
            user.Salt = passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> UserExist(string username)
        {
            var result = await _context.Users.AnyAsync(u => u.UserName == username);
            return result;
        }
    }
}