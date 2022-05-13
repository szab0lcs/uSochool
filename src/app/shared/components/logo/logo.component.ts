import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  @Input() size: 's' | 'l' = 's';
  @Input() text = true;

  constructor() { }

  ngOnInit(): void {
  }

  getBackroundImage(): string {
    if (this.size === 's') {
      if (this.text) return 'assets/images/logo_small.png';
      return 'assets/images/logo_small_only.png'
    }
    if (this.text) return 'assets/images/logo_large.png';
    return 'assets/images/logo_large_only.png'
  }

}
