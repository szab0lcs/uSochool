import { Component, OnInit } from '@angular/core';
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
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
  }

  logout(): void {
    if (!this.canLogout) {
      this.canLogout = true;
      setTimeout(() => {
        this.canLogout = false;
      }, 3000);
    } else this.navigationService.navigateTo('login');
  }

  back(): void {
    this.navigationService.back();
  }

  getBackgroundUrl(imageUrl: string) {
    return { 'background-image': `url('${imageUrl}')` };
  }

}
