import { Injectable } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class ImageUploaderService {
  baseUrl = environment.apiUrl;

  constructor(private authService: AuthService) {}

  getUploader(
    onSuccessItem: (
      item: FileItem,
      response: string,
      status: number,
      headers: ParsedResponseHeaders
    ) => any,
    onErrorItem?: (
      item: FileItem,
      response: string,
      status: number,
      headers: ParsedResponseHeaders
    ) => any
  ): FileUploader {
    const uploader = new FileUploader({
      url: `${this.baseUrl}/users/${this.authService.getUserId()}/photos`,
      authToken: `Bearer ${this.authService.getToken()}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    uploader.onSuccessItem = onSuccessItem;
    uploader.onErrorItem = onErrorItem;

    return uploader;
  }
}
