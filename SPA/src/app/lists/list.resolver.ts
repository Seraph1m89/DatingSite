import { User } from '../models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { Observable, of } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ListResolver implements Resolve<PaginatedResult<User[]>> {
  pageNumber = 1;
  pageSize = 5;
  likeParams = { likees: true };

  constructor(
    private userSerive: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<User[]>> {
    return this.userSerive.getLikes(this.pageNumber, this.pageSize, this.likeParams)
      .pipe(catchError(error => {
        this.alertify.error(error);
        this.router.navigate(['/home']);
        return of(<PaginatedResult<User[]>>null);
      }));
  }
}
