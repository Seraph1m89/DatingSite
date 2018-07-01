import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(private authService: AuthService, private alertifyService: AlertifyService) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe(data => {
      this.alertifyService.success('Logged in successfully');
    },
      error => this.alertifyService.success(error));
  }

  logout() {
    this.authService.logout();
    this.alertifyService.message('Logged out');
  }

  getUserName() {
    return this.authService.getUserName();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

}
