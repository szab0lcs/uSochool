import { Component, OnInit } from '@angular/core';
import { ExistingRoutes } from '../app-routing.module';
import { NavigationService } from '../shared/services/navigation.service';
import { fadeInAnimation } from '../_animations/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class HomeComponent implements OnInit {
  role: 'student' | 'teacher' | 'admin' = 'admin';
  break = '<br>';

  constructor(
    private navigationService: NavigationService
  ) { }

  ngOnInit(): void {
  }

  navigateTo(url: ExistingRoutes) {
    this.navigationService.navigateTo(url);
  }
}
