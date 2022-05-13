import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimetableComponent } from './timetable.component';
import { DayComponent } from './day/day.component';



@NgModule({
  declarations: [
    TimetableComponent,
    DayComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TimetableModule { }
