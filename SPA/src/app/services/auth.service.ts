import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environment.apiUrl + 'auth/';
  private decodedToken: any;
  private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhoto = this.photoUrl.asObservable();

  constructor(private httpClient: HttpClient, private jwtHelper: JwtHelperService) {}

  changeMainPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
    const user = <User>JSON.parse(localStorage.getItem('user'));
    user.mainPhotoUrl = photoUrl;
    localStorage.setItem('user', JSON.stringify(user));
  }

  login(model: any) {
    return this.httpClient
      .post(`${this.baseUrl}login`, model).pipe(
        map((response) => {
          const data = response;
          if (data) {
            const user = <User>data['user'];
            localStorage.setItem('token', data['token']);
            localStorage.setItem('user', JSON.stringify(user));
            this.decodedToken = this.jwtHelper.decodeToken(data['token']);
            this.changeMainPhoto(user.mainPhotoUrl);
          }
        })
      );
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
    this.decodedToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  register(user: User) {
    return this.httpClient
      .post(`${this.baseUrl}register`, user);
  }

  getCurrentUser() {
    const freezedUser = Object.freeze(JSON.parse(localStorage.getItem('user')));
    return freezedUser;
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

  isRoleMatch(allowedRoles): boolean {
    let isMatch = false;
    const userRoles = this.decodedToken.role as Array<string>;
    allowedRoles.forEach(element => {
      if (userRoles.includes(element)) {
        isMatch = true;
        return;
      }
    });

    return isMatch;
  }

  getRoles() {
    return this.decodedToken.role as Array<string>;
  }
}
