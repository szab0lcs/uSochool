import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { NavigationService } from '../shared/services/navigation.service';
import { ThemeService } from '../shared/services/theme.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  canLogout = false;
  constructor(
    private navigationService: NavigationService,
    public themeService: ThemeService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  logout(): void {
    if (!this.canLogout) {
      this.canLogout = true;
      setTimeout(() => {
        this.canLogout = false;
      }, 3000);
    } else this.authService.SignOut();
  }

  back(): void {
    this.navigationService.back();
  }

  getBackgroundUrl(imageUrl: string) {
    return { 'background-image': `url('${imageUrl}')` };
  }

}
