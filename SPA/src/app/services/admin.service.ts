import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getUsersWithRoles() {
    return this.httpClient.get<User[]>(`${this.baseUrl}admin/usersWithRoles`);
  }

  updateUserRoles(user: User, roles: {}) {
    return this.httpClient.post(`${this.baseUrl}admin/editRoles/${user.userName}`, roles);
  }
}
