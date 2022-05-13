import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'usochool';
  appBackgroundObs$: Observable<string[]>;
  constructor(
    private themeService: ThemeService
  ){
    this.appBackgroundObs$ = this.themeService.activeScheme$;
  }


  getThemeColor(i: number, colorScheme: string[]) {
    const color = colorScheme[i-1];
    return {'background': color};
  }
}
