import { User } from '../models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { PaginatedResult } from '../models/pagination';

@Injectable()
export class MemberListResolver implements Resolve<PaginatedResult<User[]>> {
  pageNumber = 1;
  pageSize = 10;

  constructor(
    private userSerive: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(router: ActivatedRouteSnapshot): Observable<PaginatedResult<User[]>> {
    return this.userSerive.getUsers(this.pageNumber, this.pageSize).catch(error => {
      this.alertify.error(error);
      this.router.navigate(['/home']);
      return Observable.of(<PaginatedResult<User[]>>null);
    });
  }
}
