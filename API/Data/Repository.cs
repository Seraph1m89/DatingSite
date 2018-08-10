﻿using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T : class;

        void Delete<T>(T entity) where T : class;

        Task<bool> SaveAll();

        Task<User> GetUser(int id);

        Task<T> Get<T>(int id) where T: class;

        Task<IEnumerable<T>> FindBy<T>(Expression<Func<T, bool>> predicate) where T : class;

        Task<PagedList<User>> GetUsers(UserQueryParams userQueryParams);

        Task<PagedList<User>> GetUsers(LikesQueryParams likesQueryParams);

        Task<Like> GetLike(int userId, int recepientId);

        Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId);

        Task<PagedList<Message>> GetMessagesForUser(MessageQueryParams messageQueryParams);
    }

    public class MessageQueryParams : UserQueryParamsBase
    {
        public string MessageContainer { get; set; } = "Unread";
    }
}
