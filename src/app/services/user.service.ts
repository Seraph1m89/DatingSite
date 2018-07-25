import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RequestOptions, Headers, Response, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { ErrorHandlerService } from './error-handler.service';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from './auth.service';
import { PaginatedResult } from '../models/pagination';

@Injectable()
export class UserService {

    baseUrl = environment.apiUrl;
    constructor(private authHttp: AuthHttp, private errorHandlerService: ErrorHandlerService, private authService: AuthService) { }

    getUsers(page?, itemsPerPage?): Observable<PaginatedResult<User[]>> {
        const requestOptions = new RequestOptions();
        requestOptions.params = new URLSearchParams();
        requestOptions.params.append('pageNumber', page);
        requestOptions.params.append('pageSize', itemsPerPage);

        return this.authHttp.get(`${this.baseUrl}/users`, requestOptions)
        .map((response: Response) => {
            const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
            paginatedResult.results = <User[]>response.json();
            if (response.headers.get('Pagination') != null) {
                paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
            }
            return paginatedResult;
        })
        .catch(this.errorHandlerService.handleError);
    }

    getUser(id: number): Observable<User> {
        return this.authHttp.get(`${this.baseUrl}/users/${id}`)
        .map((response: Response) => <User>response.json())
        .catch(this.errorHandlerService.handleError);
    }

    updateUser(id: number, user: User) {
        return this.authHttp.put(`${this.baseUrl}/users/${id}`, user)
        .catch(this.errorHandlerService.handleError);
    }

    setMainPhoto(id: number) {
        return this.authHttp.put(`${this.baseUrl}/users/${this.authService.getUserId()}/photos/${id}/setMain`, {})
        .catch(this.errorHandlerService.handleError);
    }

    deletePhoto(id: number) {
        return this.authHttp.delete(`${this.baseUrl}/users/${this.authService.getUserId()}/photos/${id}`)
        .catch(this.errorHandlerService.handleError);
    }
}
