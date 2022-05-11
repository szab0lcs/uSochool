import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Grade, INITIAL_GRADE_VALUE } from '../../catalogue-types';

@Component({
  selector: 'app-add-grades',
  templateUrl: './add-grades.component.html',
  styleUrls: ['./add-grades.component.scss']
})
export class AddGradesComponent implements OnInit {
  data: Grade = INITIAL_GRADE_VALUE;
  constructor(
    public matDialogRef: MatDialogRef<AddGradesComponent>,
  ) {}

  ngOnInit(): void {
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
    this.data.value = this.data.value - 1;
  }
  
  plusGrade() {
    if(this.data.value === 10 || this.data.value === null) return;
    this.data.value = this.data.value + 1;
  }

  save() {
    this.matDialogRef.close(this.data);
  }
}

