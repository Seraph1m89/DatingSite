using System;
using System.Collections.Generic;

namespace DatingApp.API.Models
{
    public class User
    {
        public User()
        {
            Photos = new HashSet<Photo>();
            Likees = new HashSet<Like>();
            Likers = new HashSet<Like>();
            MessagesRecieved = new HashSet<Message>();
            MessagesSent = new HashSet<Message>();
        }

        public int Id { get; set; }

        public string UserName { get; set; }

        public byte[] PasswordHash { get; set; }

        public byte[] Salt { get; set; }

        public string Gender { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string KnownAs { get; set; }

        public DateTime Created { get; set; }

        public DateTime LastActive { get; set; }

        public string Introduction { get; set; }

        public string LookingFor { get; set; }

        public string Interests { get; set; }

        public string City { get; set; }

        public string Country { get; set; }

        public ICollection<Photo> Photos { get; set; }

        public ICollection<Like> Likers { get; set; }

        public ICollection<Like> Likees { get; set; }

        public ICollection<Message> MessagesSent { get; set; }

        public ICollection<Message> MessagesRecieved { get; set; }
    }
}