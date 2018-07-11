using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace DatingApp.API.Helpers
{
    public class CurrentUserAttribute : ActionFilterAttribute
    {
        public string UserIdParameter { get; set; } = "userId";

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            context.ActionArguments.TryGetValue(UserIdParameter, out var userid);
            if (userid?.ToString() != context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value)
            {
                context.Result = new UnauthorizedResult();
            }

            base.OnActionExecuting(context);
        }
    }
}
