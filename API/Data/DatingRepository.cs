using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;

        public DatingRepository(DataContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<User> GetUser(int id)
        {
            return await _context.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<PagedList<User>> GetUsers(UserQueryParams userQueryParams)
        {
            var results = _context.Users.Include(u => u.Photos).Where(u => u.Id != userQueryParams.CurrentUserId && u.Gender == userQueryParams.Gender);

            var minDateOfBirth = DateTime.Today.AddYears(-userQueryParams.MaxAge - 1);
            var maxDateOfBirth = DateTime.Today.AddYears(-userQueryParams.MinAge);
            results = results.Where(u => u.DateOfBirth >= minDateOfBirth && u.DateOfBirth <= maxDateOfBirth);

            if (!string.IsNullOrWhiteSpace(userQueryParams.OrderBy))
            {
                results = results.OrderByDescending(u =>
                    userQueryParams.OrderBy.Equals("created", StringComparison.InvariantCultureIgnoreCase)
                        ? u.Created
                        : u.LastActive);
            }
            else
            {
                results = results.OrderByDescending(u => u.LastActive);
            }

            return await PagedList<User>.CreateAsync(results, userQueryParams.PageNumber, userQueryParams.PageSize);
        }

        public async Task<T> Get<T>(int id) where T: class
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public async Task<IEnumerable<T>> FindBy<T>(Expression<Func<T, bool>> predicate) where T : class
        {
            return await _context.Set<T>().Where(predicate).ToListAsync();
        }
    }
}