import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private alertingService: AlertifyService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const roles = next.firstChild.data['roles'] as Array<string>;
    if (roles) {
      const match = this.authService.isRoleMatch(roles);
      if (match) {
        return true;
      } else {
        this.router.navigate(['/members']);
        this.alertingService.error('You are not authorized to use this area');
      }
    }
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.alertingService.error('You must be logged in to access this link');

    this.router.navigate(['/home']);
    return false;
  }
}
