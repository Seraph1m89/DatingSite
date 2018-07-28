using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Mvc.Filters;

namespace DatingApp.API.Helpers
{
    public class LogUserActivityFilter : IAsyncActionFilter
    {
        private readonly IDatingRepository _repository;

        public LogUserActivityFilter(IDatingRepository repository)
        {
            _repository = repository;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            var userId = int.Parse(resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var user = await _repository.GetUser(userId);
            user.LastActive = DateTime.Now;
            await _repository.SaveAll();
        }
    }
}
