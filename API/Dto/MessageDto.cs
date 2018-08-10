using System;

namespace DatingApp.API.Dto
{
    public class MessageDto
    {
        public MessageDto()
        {
            MessageSent = DateTime.Now;
        }

        public int SenderId { get; set; }

        public int RecipientId { get; set; }

        public DateTime MessageSent { get; set; }

        public string Content { get; set; }
    }
}