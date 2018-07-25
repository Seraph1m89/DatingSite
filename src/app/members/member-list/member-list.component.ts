import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResult, Pagination } from '../../models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  constructor(private activatedRoute: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.users = (<PaginatedResult<User[]>>data['users']).results;
      this.pagination = (<PaginatedResult<User[]>>data['users']).pagination;
    });
  }

  pageChanged(event: any) {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage)
    .subscribe((res: PaginatedResult<User[]>) => {this.users = res.results;
    this.pagination = res.pagination;
    });
  }
}
