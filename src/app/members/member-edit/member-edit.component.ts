import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { NgForm } from '@angular/forms';
import { AlertifyService } from '../../services/alertify.service';
import { ICanDeactivate } from '../../interfaces/can-deactivate.interface';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit, ICanDeactivate, OnDestroy {

  user: User;
  @ViewChild('editForm') editForm: NgForm;
  photoUrl: string;
  private subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => (this.user = data['user']));
    this.subscription = this.authService.currentPhoto.subscribe(photo => this.user.mainPhotoUrl = photo);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
