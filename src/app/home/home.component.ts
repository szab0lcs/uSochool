import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInAnimation } from '../_animations/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class HomeComponent implements OnInit {
  role: 'user' | 'teacher' | 'admin' = 'user';
  break = '<br>';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  navigateToLogin() {    
    this.router.navigateByUrl('login');
  }

  navigateToCatalogue() {    
    this.router.navigateByUrl('catalogue');
  }
}
