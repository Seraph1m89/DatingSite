using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        private readonly DataContext _context;
        private readonly IPasswordService _passwordService;

        public Seed(DataContext context, IPasswordService passwordService)
        {
            _context = context;
            _passwordService = passwordService;
        }

        public void SeedUsers()
        {
            _context.RemoveRange(_context.Users);
            _context.SaveChanges();

            var userData = File.ReadAllText("Data/UserSeedData.json");
            var users = JsonConvert.DeserializeObject<List<User>>(userData);
            foreach (var user in users)
            {
                _passwordService.CreatePasswordHash("password", out var passwordHash, out var salt);
                user.PasswordHash = passwordHash;
                user.Salt = salt;
                user.UserName = user.UserName.ToLower();

                _context.Add(user);
            }

            _context.SaveChanges();
        }
    }
}
