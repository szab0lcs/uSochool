import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { NavigationService } from '../shared/services/navigation.service';
import { DayComponent } from './day/day.component';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
  dayOfTheWeek: number = 0;
  days = days;
  constructor(
    private navigationService: NavigationService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.dayOfTheWeek = moment(new Date()).day();   
  }

  async openDay(data: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = data;

    const dialog = this.matDialog.open(DayComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();
  }

  back(): void {
    this.navigationService.back();
  }
}

export const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
