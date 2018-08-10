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

        public async Task<PagedList<User>> GetUsers(LikesQueryParams likesQueryParams)
        {
            var results = _context.Users.AsQueryable();

            if (likesQueryParams.Likers)
            {
                var userLikers = await GetUserLikers(likesQueryParams.CurrentUserId);
                results = results.Where(u => userLikers.Contains(u.Id));
            }

            if (likesQueryParams.Likees)
            {
                var userLikees = await GetUserLikees(likesQueryParams.CurrentUserId);
                results = results.Where(u => userLikees.Contains(u.Id));
            }

            results = results.Include(u => u.Photos);

            return await PagedList<User>.CreateAsync(results, likesQueryParams.PageNumber, likesQueryParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikees(int id)
        {
            var user = await _context.Users.Include(u => u.Likees).FirstOrDefaultAsync(u => u.Id == id);

            return user.Likees.Where(like => like.LikerId == id).Select(like => like.LikeeId);
        }

        private async Task<IEnumerable<int>> GetUserLikers(int id)
        {
            var user = await _context.Users.Include(u => u.Likers).FirstOrDefaultAsync(u => u.Id == id);

            return user.Likers.Where(like => like.LikeeId == id).Select(like => like.LikerId);
        }

        public async Task<Like> GetLike(int userId, int recepientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recepientId);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await getMessages().Where(m =>
                IncludeRecipientMessage(userId, recipientId, m) ||
                IncludeSenderMessage(userId, recipientId, m))
                .OrderByDescending(m => m.MessageSent)
                .ToListAsync();

            return messages;
        }

        private static bool IncludeSenderMessage(int userId, int recipientId, Message m)
        {
            return m.RecipientId == recipientId && m.SenderId == userId && !m.SenderDeleted;
        }

        private static bool IncludeRecipientMessage(int userId, int recipientId, Message m)
        {
            return m.RecipientId == userId && m.SenderId == recipientId && !m.RecipientDeleted;
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageQueryParams messageQueryParams)
        {
            var messages = getMessages();

            switch (messageQueryParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(m =>
                        m.RecipientId == messageQueryParams.CurrentUserId && !m.RecipientDeleted);
                    break;
                case "Outbox":
                    messages = messages.Where(m => m.SenderId == messageQueryParams.CurrentUserId && !m.SenderDeleted);
                    break;
                default:
                    messages = messages.Where(m => m.RecipientId == messageQueryParams.CurrentUserId
                                                   && m.IsRead == false
                                                   && !m.RecipientDeleted);
                    break;
            }

            messages = messages.OrderByDescending(m => m.MessageSent);
            return await PagedList<Message>.CreateAsync(messages, messageQueryParams.PageNumber, messageQueryParams.PageSize);
        }

        private IQueryable<Message> getMessages()
        {
            return _context.Messages
                .Include(m => m.Sender).ThenInclude(u => u.Photos)
                .Include(m => m.Recipient).ThenInclude(u => u.Photos)
                .AsQueryable();
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