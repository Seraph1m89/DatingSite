import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { Pagination, PaginatedResult } from '../models/pagination';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer: 'Unread';

  constructor(private userService: UserService, private authService: AuthService,
    private activatedRoute: ActivatedRoute, private alertifyService: AlertifyService) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.messages = data['messages'].results;
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages() {
    this.userService.getMessages(this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer)
      .subscribe((response: PaginatedResult<Message[]>) => {
        this.messages = response.results;
        this.pagination = response.pagination;
      }, error => this.alertifyService.error(error));
  }

  pageChanged(event: any) {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  deleteMessage(messageId: number) {
    this.alertifyService.confirm('Are you sure you want to delete this message?',
      () => this.userService.deleteMessage(messageId)
        .subscribe(() => {
          this.messages.splice(this.messages.findIndex(m => m.id === messageId), 1);
          this.alertifyService.success('You\'ve deleted a message');
        }, error => this.alertifyService.error(error)));
  }
}
