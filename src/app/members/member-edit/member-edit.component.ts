import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { NgForm } from '@angular/forms';
import { AlertifyService } from '../../services/alertify.service';
import { ICanDeactivate } from '../../interfaces/can-deactivate.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit, ICanDeactivate {
  user: User;
  @ViewChild('editForm') editForm: NgForm;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => (this.user = data['user']));
  }

  canDeactivate() {
    return this.editForm.dirty;
  }

  updateUser() {
    this.userService.updateUser(this.user.id, this.user).subscribe(
      () => {
        this.alertify.success('You\'ve updated your profile');
        this.editForm.reset(this.user);
      },
      error => this.alertify.error(error)
    );
  }
}
