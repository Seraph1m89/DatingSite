import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { ErrorHandlerService } from './error-handler.service';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class UserService {

    baseUrl = environment.apiUrl;
    constructor(private authHttp: AuthHttp, private errorHandlerService: ErrorHandlerService) { }

    getUsers(): Observable<User[]> {
        return this.authHttp.get(`${this.baseUrl}/users`)
        .map((response: Response) => <User[]>response.json())
        .catch(this.errorHandlerService.handleError);
    }

    getUser(id: number): Observable<User> {
        return this.authHttp.get(`${this.baseUrl}/users/${id}`)
        .map((response: Response) => <User>response.json())
        .catch(this.errorHandlerService.handleError);
    }
}
