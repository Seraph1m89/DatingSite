import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { HttpModule } from '@angular/http';

import { AlertifyService } from './services/alertify.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AppRoutes } from './app-route.routing';
import { AuthGuard } from './guards/auth.guard';
import { ErrorHandlerService } from './services/error-handler.service';
import { UserService } from './services/user.service';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { AuthModule } from './auth/auth.module';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './resolvers/member-detail.resolver';
import { MemberListResolver } from './resolvers/member-list.resolver';
import { NgxGalleryModule } from 'ngx-gallery';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './resolvers/member-edit.resolver';
import { PreventUnsavedChanged } from './guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageUploaderService } from './services/image-uploader.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MomentModule } from 'ngx-moment';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      ListsComponent,
      MessagesComponent,
      MemberCardComponent,
      MemberDetailComponent,
      MemberEditComponent,
      PhotoEditorComponent
   ],
   imports: [
      BrowserModule,
      HttpModule,
      FormsModule,
      BsDropdownModule.forRoot(),
      TabsModule.forRoot(),
      AppRoutes,
      AuthModule,
      NgxGalleryModule,
      FileUploadModule,
      ReactiveFormsModule,
      BsDatepickerModule.forRoot(),
      MomentModule,
      PaginationModule.forRoot()
   ],
   providers: [
      AuthService,
      AlertifyService,
      AuthGuard,
      ErrorHandlerService,
      UserService,
      MemberDetailResolver,
      MemberListResolver,
      MemberEditResolver,
      PreventUnsavedChanged,
      ImageUploaderService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
