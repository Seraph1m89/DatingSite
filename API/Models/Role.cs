using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace DatingApp.API.Models
{
    public class Role : IdentityRole<int>
    {
        public Role()
        {
            UserRoles = new HashSet<UserRole>();
        }

        public ICollection<UserRole> UserRoles { get; set; }
    }
}
