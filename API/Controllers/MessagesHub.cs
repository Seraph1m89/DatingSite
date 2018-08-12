using System.Threading.Tasks;
using DatingApp.API.Dto;
using Microsoft.AspNetCore.SignalR;

namespace DatingApp.API.Controllers
{
    public class MessagesHub : Hub
    {
        public async Task SendMessageToClient(int clientId, MessageToReturnDto message)
        {
            await Clients.User(clientId.ToString()).SendAsync("RecieveMessage", message);
        }
    }
}
