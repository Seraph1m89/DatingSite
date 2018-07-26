import { User } from '../models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {
  constructor(
    private userSerive: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) { }

  resolve(router: ActivatedRouteSnapshot): Observable<User> {
    return this.userSerive.getUser(+router.params['id'])
      .pipe(catchError(error => {
        this.alertify.error(error);
        this.router.navigate(['/members']);
        return of(<User>null);
      }));
  }
}
