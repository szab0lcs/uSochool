import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { Grade, INITIAL_GRADE_VALUE } from '../../catalogue-types';

@Component({
  selector: 'app-add-grades',
  templateUrl: './add-grades.component.html',
  styleUrls: ['./add-grades.component.scss']
})
export class AddGradesComponent implements OnInit {
  convertedDate: Date = new Date();
  data: Grade = INITIAL_GRADE_VALUE;
  displayOptions = false;
  constructor(
    public matDialogRef: MatDialogRef<AddGradesComponent>,
  ) {}

  ngOnInit(): void {
    this.data.value = 10;
  }

  timestampToDate(value: number) {
    return new Date(moment.unix(value).format('MM/DD/YYYY'));
  }

  dateChangeHandler(date: Date){
    const timestamp = moment(date).unix();
    this.data.date = timestamp;
  }

  minusGrade() {
    if(this.data.value === 1 || this.data.value === null) return;
    this.data.value -= 1;
  }
  
  plusGrade() {
    if(this.data.value === 10 || this.data.value === null) return;
    this.data.value += 1;
  }

  save() {
    if (this.data.date === null) this.data.date = moment(new Date()).unix();
    this.matDialogRef.close(this.data);
  }
}

