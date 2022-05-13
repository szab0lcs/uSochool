import { Component, OnInit } from '@angular/core';
import { ExistingRoutes } from '../app-routing.module';
import { AuthService } from '../shared/services/auth.service';
import { NavigationService } from '../shared/services/navigation.service';
import { UserService } from '../shared/services/user.service';
import { fadeInAnimation } from '../_animations/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class HomeComponent implements OnInit {
  role: 'student' | 'teacher' | 'admin' = 'teacher';
  break = '<br>';

  constructor(
    private navigationService: NavigationService,
    public authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(data => console.log({user: data}))
  }

  navigateTo(url: ExistingRoutes) {
    this.navigationService.navigateTo(url);
  }
}
