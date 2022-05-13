import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { Absence, Grade, INITIAL_ABSENCE_VALUE, INITIAL_GRADE_VALUE } from '../../catalogue-types';

@Component({
  selector: 'app-add-absences',
  templateUrl: './add-absences.component.html',
  styleUrls: ['./add-absences.component.scss']
})
export class AddAbsencesComponent implements OnInit {
  convertedDate: Date = new Date();
  constructor(
    public matDialogRef: MatDialogRef<AddAbsencesComponent>,
  ) {}

  ngOnInit(): void {}

  timestampToDate(value: number) {
    return new Date(moment.unix(value).format('MM/DD/YYYY'));
  }

  dateChangeHandler(date: Date){
    this.convertedDate = date;
  }

  add() {
    const date = moment(this.convertedDate).unix();
    this.matDialogRef.close(date);
  }
}

