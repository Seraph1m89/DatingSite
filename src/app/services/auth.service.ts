import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

    private baseUrl = 'http://localhost:5000/api/auth';
    private userToken: any;

    constructor(private http: Http) { }

    login(model: any) {
        const headers = new Headers({'Content-type': 'application/json'});
        const options = new RequestOptions({headers});
        return this.http.post(`${this.baseUrl}/login`, model).map((response: Response) => {
            const data = response.json();
            if (data) {
                localStorage.setItem('token', data['token']);
                this.userToken = data['token'];
            }
        }).catch(this.handleError);
    }

    logout(): void {
        this.userToken = null;
        localStorage.removeItem('token');
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    register(model: any) {
        return this.http.post(`${this.baseUrl}/register`, model).catch(this.handleError);
    }

    private handleError(error: any) {
        const applicatioError = error.headers.get('Application-Error');
        if (applicatioError) {
            return Observable.throw(applicatioError);
        }
        const serverError = error.json();
        let modelStateErrors = '';
        if (serverError) {
            for (const key in serverError) {
                if (serverError[key]) {
                    modelStateErrors += `${serverError[key]}\n`;
                }
            }
        }

        return Observable.throw(modelStateErrors || 'Server error');
    }
}
