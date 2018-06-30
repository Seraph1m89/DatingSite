import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

    private baseUrl = 'http://localhost:5000/api/auth';
    private userToken: any;

    constructor(private httpClient: HttpClient) { }

    login(model: any) {
        const headers = new Headers({'Content-type': 'application/json'});
        const options = new RequestOptions({headers});
        return this.httpClient.post(`${this.baseUrl}/login`, model).map(data => {
            if (data) {
                localStorage.setItem('token', data['token']);
                this.userToken = data['token'];
            }
        });
    }

    logout(): void {
        this.userToken = null;
        localStorage.removeItem('token');
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    register(model: any) {
        return this.httpClient.post(`${this.baseUrl}/register`, model);
    }
}
