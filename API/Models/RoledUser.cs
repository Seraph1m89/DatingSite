using System.Collections.Generic;

namespace DatingApp.API.Models
{
    public class RoledUser
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public IList<string> Roles { get; set; }
    }
}
