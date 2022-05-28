import { Component, OnInit } from '@angular/core';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AllUserData, PublicData } from '../shared/interfaces/user';
import { FileUpload } from '../shared/models/file-upload.model';
import { AuthService } from '../shared/services/auth.service';
import { FileUploadService } from '../shared/services/file-upload.service';
import { NavigationService } from '../shared/services/navigation.service';
import { ThemeService } from '../shared/services/theme.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  canLogout = false;
  userData$: Observable<AllUserData | null>;
  constructor(
    private navigationService: NavigationService,
    public themeService: ThemeService,
    public authService: AuthService,
    private userService: UserService,
    private uploadService: FileUploadService,
    private toastr: ToastrService
  ) { 
    this.userData$ = this.userService.currentUser$;
  }

  ngOnInit(): void {
  }

  logout(): void {
    if (!this.canLogout) {
      this.canLogout = true;
      setTimeout(() => {
        this.canLogout = false;
      }, 3000);
    } else this.authService.signOut();
  }

  back(): void {
    this.navigationService.back();
  }

  getBackgroundUrl(user: PublicData) {
    if(user.userImage) return { 'background-image': `url('${user.userImage}')` };
    return null;
  }

  uploadFile(event: any, userId: string) {
    const selectedFiles = event.target.files;
    if(selectedFiles) {
      const file: File | null = selectedFiles.item(0);
      if(file) {
        if (file.size > 50000000) {
          this.toastr.warning('The maximum file size is 5MB.','File is too big',{positionClass: 'toast-bottom-center'});
          return;
        }
        const currentFileUpload: FileUpload = new FileUpload(file);
        const path: string = `${userId}`;
        this.uploadService.pushFileToStorage(currentFileUpload,path,'profile_pic','profile_pic').subscribe( () => {},
        error => {
          console.log(error);
        })
      }
    }
  }

}
