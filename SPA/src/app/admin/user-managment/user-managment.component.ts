import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { AdminService } from '../../services/admin.service';
import { AlertifyService } from '../../services/alertify.service';
import { BsModalService, BsModalRef } from '../../../../node_modules/ngx-bootstrap';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.css']
})
export class UserManagmentComponent implements OnInit {
  users: User[];
  bsModalRef: BsModalRef;

  constructor(
    private adminService: AdminService,
    private alertifyService: AlertifyService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService
      .getUsersWithRoles()
      .subscribe(
        users => (this.users = users),
        error => this.alertifyService.error(error)
      );
  }

  editRolesModal(user: User) {
    const initialState = {
      user,
      roles: this.getRoles(user)
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, {initialState});
    this.bsModalRef.content.updateSelectedRoles.subscribe((values) => {
      const rolesToUpdate = {
        roleNames: [
          ...values.filter(el => el.isChecked).map(el => el.name)
        ]
      };
      if (rolesToUpdate) {
        this.adminService.updateUserRoles(user, rolesToUpdate)
        .subscribe(() => user.roles = [...rolesToUpdate.roleNames],
      error => this.alertifyService.error(error));
      }
      console.log(rolesToUpdate);
    });
  }

  private getRoles(user) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      {name: 'Admin', value: 'Admin'},
      {name: 'Moderator', value: 'Moderator'},
      {name: 'Member', value: 'Member'}
    ];
    for (let i = 0; i < availableRoles.length; i++) {
      const role = availableRoles[i];
      let isMatch = false;
      for (let j = 0; j < userRoles.length; j++) {
        const userRole = userRoles[j];
        if (role.name === userRole) {
          isMatch = true;
          role.isChecked = true;
          roles.push(role);
          break;
        }
      }
      if (!isMatch) {
        role.isChecked = false;
        roles.push(role);
      }
    }

    return roles;
  }
}
