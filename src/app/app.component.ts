import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from './shared/services/theme.service';
import { Capacitor } from '@capacitor/core';
import { initializeApp } from 'firebase/app';
import { indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { environment } from 'src/environments/environment';

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
    const app = initializeApp(environment.firebase);
    if (Capacitor.isNativePlatform()) {
      initializeAuth(app, {
        persistence: indexedDBLocalPersistence
      });
    }
  }

  getThemeColor(i: number, colorScheme: string[]) {
    const color = colorScheme[i-1];
    return {'background': color};
  }
}
