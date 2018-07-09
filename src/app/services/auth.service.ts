import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Observable } from 'rxjs/Observable';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { ErrorHandlerService } from './error-handler.service';

@Injectable()
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';
  private userToken: any;
  private decodedToken: any;
  private jwtHelper = new JwtHelper();

  constructor(private http: Http, private errorHandlerService: ErrorHandlerService) {}

  login(model: any) {
    const headers = new Headers({ 'Content-type': 'application/json' });
    const options = new RequestOptions({ headers });
    return this.http
      .post(`${this.baseUrl}/login`, model)
      .map((response: Response) => {
        const data = response.json();
        if (data) {
          localStorage.setItem('token', data['token']);
          this.decodedToken = this.jwtHelper.decodeToken(data['token']);
          console.log(this.decodedToken);
          this.userToken = data['token'];
        }
      })
      .catch(this.errorHandlerService.handleError);
  }

  getUserName() {
      return this.decodedToken && this.decodedToken['unique_name'] || null;
  }

  getUserId(): number {
    return this.decodedToken && this.decodedToken['nameid'] || 0;
  }

  logout(): void {
    this.userToken = null;
    this.decodedToken = null;
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return tokenNotExpired('token');
  }

  register(model: any) {
    return this.http
      .post(`${this.baseUrl}/register`, model)
      .catch(this.errorHandlerService.handleError);
  }

  refreshToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.decodedToken = this.jwtHelper.decodeToken(token);
    }
  }
}
