import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ExistingRoutes } from '../app-routing.module';
import { AllUserData } from '../shared/interfaces/user';
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
  role$: Observable<string>;
  userData$: Observable<AllUserData | null>;
  break = '<br>';

  constructor(
    public navS: NavigationService,
    public authService: AuthService,
    private userService: UserService
  ) { 
    this.role$ = this.userService.getUserMainRole$().pipe(distinctUntilChanged());
    this.userData$ = this.userService.currentUser$;
  }

  ngOnInit(): void {
  }

}
