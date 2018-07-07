import { User } from '../models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {
  constructor(
    private userSerive: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(router: ActivatedRouteSnapshot): Observable<User> {
    return this.userSerive.getUser(+router.params['id']).catch(error => {
      this.alertify.error(error);
      this.router.navigate(['/members']);
      return Observable.of(<User>null);
    });
  }
}
