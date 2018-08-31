import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './resolvers/member-detail.resolver';
import { MemberListResolver } from './resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './resolvers/member-edit.resolver';
import { PreventUnsavedChanged } from './guards/prevent-unsaved-changes.guard';
import { ListResolver } from './lists/list.resolver';
import { MessagesResolver } from './messages/messages.resolver';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'members',
        component: MemberListComponent,
        resolve: { users: MemberListResolver }
      },
      {
        path: 'members/edit',
        component: MemberEditComponent,
        resolve: { user: MemberEditResolver },
        canDeactivate: [PreventUnsavedChanged]
      },
      {
        path: 'members/:id',
        component: MemberDetailComponent,
        resolve: { user: MemberDetailResolver }
      },
      {
        path: 'messages',
        component: MessagesComponent,
        resolve: { messages: MessagesResolver }
      },
      {
        path: 'lists',
        component: ListsComponent,
        resolve: { users: ListResolver }
      },
      {
        path: 'admin',
        component: AdminPanelComponent,
        data: { roles: ['Admin', 'Moderator']}
      }
    ]
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
