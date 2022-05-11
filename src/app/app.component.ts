import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'usochool';
  purpleColorScheme = [
    '#6BC5D9',
    '#9E379F',
    '#FCBEF7',
    '#9E379F',
    '#b8bdd4',
    '#7ac8db'
  ]
  greenColorScheme = [
    '#64a2ff',
    '#4b961c',
    '#bad6ff',
    '#79cb3d',
    '#bad6ff',
    '#7adbc0'
  ]

  getThemeColor(i: number, colorScheme: string[]) {
    const color = colorScheme[i-1];
    return {'background': color};
  }
}
