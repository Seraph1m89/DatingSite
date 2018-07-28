import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResult, Pagination } from '../../models/pagination';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  currentUser: User;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  userParams: any = {};
  pagination: Pagination;
  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.users = (<PaginatedResult<User[]>>data['users']).results;
      this.pagination = (<PaginatedResult<User[]>>data['users']).pagination;
    });
    this.currentUser = this.authService.getCurrentUser();
    this.resetFilters(false);
  }

  pageChanged(event: any) {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
    .subscribe((res: PaginatedResult<User[]>) => {this.users = res.results;
    this.pagination = res.pagination;
    });
  }

  private resetFilters(reload: boolean) {
    this.userParams.gender = this.currentUser.gender === 'male' ? 'female' : 'male';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
    if (reload) {
      this.loadUsers();
    }
  }
}
