import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(private authService: AuthService, private alertifyService: AlertifyService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe(data => {
      this.alertifyService.success('Logged in successfully');
    },
    () => this.alertifyService.success('Failed to log in'),
    () => this.router.navigate(['/members']));
  }

  logout() {
    this.authService.logout();
    this.alertifyService.message('Logged out');
    this.router.navigate(['/home']);
  }

  getUserName() {
    return this.authService.getUserName();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

}
