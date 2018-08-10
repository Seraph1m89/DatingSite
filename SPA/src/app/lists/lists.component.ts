import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from '../models/pagination';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  likeParams: { likers: boolean, likees: boolean } = { likees: true, likers: false };
  pagination: Pagination;
  users: User[];
  isLikees = 'true';

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.users = data['users'].results;
      this.pagination = data['users'].pagination;
    });
  }

  pageChanged(event: any) {
    this.pagination.currentPage = event.page;
    this.loadUsers(this.likeParams.likees);
  }

  loadUsers(likees: boolean) {
    this.isLikees = likees.toString();
    this.likeParams.likees = likees;
    this.likeParams.likers = !likees;
    this.userService.getLikes(this.pagination.currentPage, this.pagination.itemsPerPage, this.likeParams)
      .subscribe((res: PaginatedResult<User[]>) => {
        this.users = res.results;
        this.pagination = res.pagination;
      });
  }

}
