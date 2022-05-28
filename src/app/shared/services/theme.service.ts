import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  colors = {
    purple: [
      '#6BC5D9',
      '#9E379F',
      '#FCBEF7',
      '#9E379F',
      '#b8bdd4',
      '#7ac8db'
    ],
    green: [
      '#64a2ff',
      '#4b961c',
      '#bad6ff',
      '#79cb3d',
      '#bad6ff',
      '#7adbc0'
    ]
  }
  activeColor$ = new BehaviorSubject<ColorSchemes>('purple');

  constructor() {
    const localTheme = localStorage.getItem('theme');
    const savedColor: ColorSchemes | null = localTheme ? localTheme as ColorSchemes : null;
    if (savedColor) this.activeColor$.next(savedColor);
  }

  switchColor() {
    if (this.activeColor$.value === 'purple') {
      localStorage.setItem('theme','green');
      this.activeColor$.next('green');
    }
    else {
      localStorage.setItem('theme','purple');
      this.activeColor$.next('purple');
    }
  }

  getActiveColor$(): Observable<string[]> {
    return this.activeColor$.pipe(map( color => this.colors[color]))
  }

}
export type ColorSchemes = 'purple' | 'green';
