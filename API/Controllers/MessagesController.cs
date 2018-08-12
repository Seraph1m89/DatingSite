using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dto;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivityFilter))]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IHubContext<MessagesHub> _hubContext;

        public MessagesController(IDatingRepository repo, IMapper mapper, IHubContext<MessagesHub> hubContext)
        {
            _repo = repo;
            _mapper = mapper;
            _hubContext = hubContext;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        [CurrentUser]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            var messageFromRepo = await _repo.Get<Message>(id);

            if (messageFromRepo == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<MessageDto>(messageFromRepo));
        }

        [HttpGet]
        [CurrentUser]
        public async Task<IActionResult> GetMessagesForUser(int userId, [FromQuery] MessageQueryParams messageQueryParams)
        {
            messageQueryParams.CurrentUserId = userId;

            var messagesFromRepo = await _repo.GetMessagesForUser(messageQueryParams);

            var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);

            Response.AddPagination(messagesFromRepo.CurrentPage, messagesFromRepo.PageSize, messagesFromRepo.TotalCount,
                messagesFromRepo.TotalPages);

            return Ok(messages);
        }

        [HttpGet("thread/{recipientId}")]
        [CurrentUser]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        {
            var messagesFromRepo = await _repo.GetMessageThread(userId, recipientId);

            var result = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);
            return Ok(result);
        }


        [HttpPost]
        [CurrentUser]
        public async Task<IActionResult> CreateMessage(int userId, MessageDto messageDto)
        {
            messageDto.SenderId = userId;

            var recipient = await _repo.GetUser(messageDto.RecipientId);

            if (recipient == null)
            {
                return BadRequest("Could not find user to send message to");
            }
            var sender = await _repo.GetUser(messageDto.SenderId);

            var message = _mapper.Map<Message>(messageDto);
            _repo.Add(message);

            if (await _repo.SaveAll())
            {
                var returnMessage = _mapper.Map<MessageToReturnDto>(message);
                returnMessage.SenderKnownAs = sender.KnownAs;
                returnMessage.SenderMainPhotoUrl = sender.Photos.FirstOrDefault(p => p.IsMain)?.Url;
                //await _hubContext.Clients.All.SendAsync("RecieveMessage", returnMessage);
                await _hubContext.Clients.User(returnMessage.RecipientId.ToString()).SendAsync("RecieveMessage", returnMessage);
                return CreatedAtRoute("GetMessage", new {id = message.Id}, returnMessage);
            }

            throw new Exception("Creating the message failed on save");
        }

        [HttpPost("{messageId}")]
        [CurrentUser]
        public async Task<IActionResult> DeleteMessage(int userId, int messageId)
        {
            var messageFromRepo = await _repo.Get<Message>(messageId);

            if (messageFromRepo.SenderId == userId)
                messageFromRepo.SenderDeleted = true;

            if (messageFromRepo.RecipientId == userId)
                messageFromRepo.RecipientDeleted = true;

            if(messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted)
                _repo.Delete(messageFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception("Error deleting the message");
        }

        [HttpPost("{messageId}/read")]
        [CurrentUser]
        public async Task<IActionResult> MarkMessageAsRead(int userId, int messageId)
        {
            var mesage = await _repo.Get<Message>(messageId);
            if (mesage.RecipientId != userId)
                return Unauthorized();

            mesage.IsRead = true;
            mesage.DateRead = DateTime.Now;
            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception("Failed to set message as read");
        }

    }
}