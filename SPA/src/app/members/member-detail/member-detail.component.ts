import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { AlertifyService } from '../../services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { INgxGalleryOptions, INgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User;
  galleryOptions: INgxGalleryOptions[] = [];
  galleryImages: INgxGalleryImage[] = [];
  @ViewChild('memberTabs') memberTabs: TabsetComponent;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.user = data['user'];
      this.galleryImages = this.getImages();
    });
    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }];
    this.activatedRoute.queryParams.subscribe(params => {
      this.selectTab(params['tab']);
    });
  }

  getImages() {
    const imageUrl: INgxGalleryImage[] = [];
    for (const photo of this.user.photos) {
      imageUrl.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description
      });
    }

    return imageUrl;
  }

  selectTab(id: number) {
    this.memberTabs.tabs[id].active = true;
  }
}
