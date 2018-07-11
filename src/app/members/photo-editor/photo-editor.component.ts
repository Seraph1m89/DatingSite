import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from '../../models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { ImageUploaderService } from '../../services/image-uploader.service';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  uploader: FileUploader = new FileUploader({});
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Photo;
  @Output() mainPhotoChanged = new EventEmitter<Photo>();

  constructor(
    private authService: AuthService,
    private imageUploadService: ImageUploaderService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.uploader = this.imageUploadService.getUploader(this.onSuccessUpload.bind(this));
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(photo.id).subscribe(() => {
      this.currentMain = _.findWhere(this.photos, { isMain: true });
      this.currentMain.isMain = false;
      photo.isMain = true;
      this.mainPhotoChanged.emit(photo);
    }, error => this.alertify.error(error));
  }

  private onSuccessUpload(item, response, status, headers) {
    if (response) {
      const res: Photo = JSON.parse(response);
      const photo = {...res
      };

      this.photos.push(photo);
    }
  }
}
