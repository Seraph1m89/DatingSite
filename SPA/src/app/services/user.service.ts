import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RequestOptions, Headers, Response, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { PaginatedResult } from '../models/pagination';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

@Injectable()
export class UserService {

    baseUrl = environment.apiUrl;
    constructor(private httpClient: HttpClient, private authService: AuthService) { }

    getUsers(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<User[]>> {

        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
          params = params.append('pageNumber', page);
          params = params.append('pageSize', itemsPerPage);
        }

        if (userParams != null) {
            for (const param in userParams) {
                if (param) {
                    params = params.append(param, userParams[param]);
                }
            }
        }

        const requestOptions = new RequestOptions();
        requestOptions.params = new URLSearchParams();
        requestOptions.params.append('pageNumber', page);
        requestOptions.params.append('pageSize', itemsPerPage);

        return this.httpClient.get<User[]>(`${this.baseUrl}users`, { observe: 'response', params})
        .pipe(
            map((response) => {
                const paginatedResult = new PaginatedResult<User[]>();
                paginatedResult.results = response.body;
                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                }
                return paginatedResult;
            })
        );
    }

    getUser(id: number): Observable<User> {
        return this.httpClient.get<User>(`${this.baseUrl}users/${id}`);
    }

    updateUser(id: number, user: User) {
        return this.httpClient.put(`${this.baseUrl}users/${id}`, user);
    }

    setMainPhoto(id: number) {
        return this.httpClient.put(`${this.baseUrl}users/${this.authService.getUserId()}/photos/${id}/setMain`, {});
    }

    deletePhoto(id: number) {
        return this.httpClient.delete(`${this.baseUrl}users/${this.authService.getUserId()}/photos/${id}`);
    }
}
