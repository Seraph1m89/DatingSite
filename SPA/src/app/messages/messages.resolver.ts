import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { PaginatedResult } from '../models/pagination';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessagesResolver implements Resolve<PaginatedResult<Message[]>> {
  pageNumber = 1;
  pageSize = 10;
  messageContainer = 'Unread';

  constructor(
    private userSerive: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<Message[]>> {
    return this.userSerive.getMessages(this.pageNumber, this.pageSize, this.messageContainer)
      .pipe(catchError(error => {
        this.alertify.error(error);
        this.router.navigate(['/home']);
        return of(<PaginatedResult<Message[]>>null);
      }));
  }
}
