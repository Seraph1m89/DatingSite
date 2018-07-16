import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response, Jsonp } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Observable } from 'rxjs/Observable';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { ErrorHandlerService } from './error-handler.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../models/user';

@Injectable()
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';
  private userToken: any;
  private decodedToken: any;
  private jwtHelper = new JwtHelper();
  private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhoto = this.photoUrl.asObservable();

  constructor(private http: Http, private errorHandlerService: ErrorHandlerService) {}

  changeMainPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
    const user = <User>JSON.parse(localStorage.getItem('user'));
    user.mainPhotoUrl = photoUrl;
    localStorage.setItem('user', JSON.stringify(user));
  }

  login(model: any) {
    const headers = new Headers({ 'Content-type': 'application/json' });
    const options = new RequestOptions({ headers });
    return this.http
      .post(`${this.baseUrl}/login`, model)
      .map((response: Response) => {
        const data = response.json();
        if (data) {
          const user = <User>data['user'];
          localStorage.setItem('token', data['token']);
          localStorage.setItem('user', JSON.stringify(user));
          this.decodedToken = this.jwtHelper.decodeToken(data['token']);
          this.userToken = data['token'];
          this.changeMainPhoto(user.mainPhotoUrl);
        }
      })
      .catch(this.errorHandlerService.handleError);
  }

  getToken() {
    return localStorage.getItem('token');
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
    localStorage.removeItem('user');
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
    const user = <User>JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.changeMainPhoto(user.mainPhotoUrl);
    }
  }
}
