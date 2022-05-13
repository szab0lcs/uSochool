import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

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
  activeScheme$ = new BehaviorSubject<string[]>(this.colors.purple)

  constructor() {}

  switchColor() {
    if (this.activeColor$.value === 'purple') {
      this.activeColor$.next('green');
      this.activeScheme$.next(this.colors['green']);
    }
    else {
      this.activeColor$.next('purple');
      this.activeScheme$.next(this.colors['purple']);
    }
  }

}
export type ColorSchemes = 'purple' | 'green';
