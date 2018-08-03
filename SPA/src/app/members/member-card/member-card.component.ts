import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;

  constructor(private userService: UserService, private alertifyService: AlertifyService) { }

  ngOnInit() {
  }

  sendLike() {
    this.userService.sendLike(this.user.id)
      .subscribe(() => this.alertifyService.success(`You've liked ${this.user.knownAs}`),
        error => this.alertifyService.error(error));
  }
}
