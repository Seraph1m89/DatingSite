import { Message } from '../../models/message';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';

import { Component, OnInit, Input } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(private userService: UserService, private alertifyService: AlertifyService, private authService: AuthService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.userService.getMessageThread(this.recipientId)
      .pipe(
        tap(messages => {
          for (let i = 0; i < messages.length; i++) {
            const userId = +this.authService.getUserId();
            if (messages[i].isRead === false && messages[i].recipientId === userId) {
              this.userService.markAsRead(messages[i].id);
            }
          }
        })
      )
      .subscribe(messages => {
        this.messages = messages;
      },
        error => this.alertifyService.error(error));
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.newMessage)
      .subscribe(message => {
        this.messages.unshift(message);
        this.newMessage.conent = '';
      },
        error => this.alertifyService.error(error));
  }
}
