import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from '../../models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { ImageUploaderService } from '../../services/image-uploader.service';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Photo;

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
      this.changeMainPhoto(photo);
    }, error => this.alertify.error(error));
  }

  deletePhoto(photo: Photo) {
    this.alertify.confirm('Are you sure you want to delete photo?', () => {
      this.userService.deletePhoto(photo.id).subscribe(() => {
        this.photos = this.photos.filter(p => p.id !== photo.id);
        this.alertify.success('Successfuly deleted photo');
      }, error => this.alertify.error(error));
    });
  }

  private onSuccessUpload(item, response, status, headers) {
    if (response) {
      const res: Photo = JSON.parse(response);
      const photo = {...res
      };
      this.photos.push(photo);
      if (photo.isMain) {
        this.changeMainPhoto(photo);
      }
    }
  }

  private changeMainPhoto(photo: Photo) {
    this.currentMain = this.photos.filter(p => p.isMain)[0];
    this.currentMain.isMain = false;
    photo.isMain = true;
    this.authService.changeMainPhoto(photo.url);
  }
}
