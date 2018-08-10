import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { PaginatedResult } from '../models/pagination';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Message } from '../models/message';
import { TouchSequence } from '../../../node_modules/@types/selenium-webdriver';

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

    sendLike(id: number) {
        return this.httpClient.post(`${this.baseUrl}users/${this.authService.getUserId()}/like/${id}`, {});
    }

    getLikes(page?, itemsPerPage?, likesQueryParams?) {
        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
          params = params.append('pageNumber', page);
          params = params.append('pageSize', itemsPerPage);
        }

        if (likesQueryParams != null) {
            for (const param in likesQueryParams) {
                if (param) {
                    params = params.append(param, likesQueryParams[param]);
                }
            }
        } else {
            params = params.append('likees', 'true');
        }

        return this.httpClient.get<User[]>(`${this.baseUrl}users/getlikes`, { observe: 'response', params})
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

    getMessages(page?: number, pageSize?: number, messageContainer?: string): Observable<PaginatedResult<Message[]>> {
        let params = new HttpParams();

        if (page != null && pageSize != null) {
            params = params.append('pageNumber', page.toString());
            params = params.append('pageSize', pageSize.toString());
        }
        params = params.append('messageContainer', messageContainer);

        return this.httpClient.get<Message[]>(`${this.baseUrl}users/${this.authService.getUserId()}/messages`,
            { observe: 'response', params })
            .pipe(
                map(response => {
                    const paginatedResult = new PaginatedResult<Message[]>();
                    paginatedResult.results = response.body;
                    if (response.headers.get('Pagination') != null) {
                        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                    }

                    return paginatedResult;
                })
            );
    }

    getMessageThread(recipientId: number) {
        return this.httpClient.get<Message[]>(`${this.baseUrl}users/${this.authService.getUserId()}/messages/thread/${recipientId}`);
    }

    sendMessage(message: Message) {
        message.senderId = this.authService.getUserId();
        return this.httpClient.post<Message>(`${this.baseUrl}users/${this.authService.getUserId()}/messages`, message);
    }

    deleteMessage(messageId: number) {
        return this.httpClient.post(`${this.baseUrl}users/${this.authService.getUserId()}/messages/${messageId}`, {});
    }

    markAsRead(messageId: number) {
        return this.httpClient.post(`${this.baseUrl}users/${this.authService.getUserId()}/messages/${messageId}/read`, {})
        .subscribe();
    }
}
