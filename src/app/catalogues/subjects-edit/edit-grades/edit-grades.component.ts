import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Grade } from '../../catalogue-types';

@Component({
  selector: 'app-edit-grades',
  templateUrl: './edit-grades.component.html',
  styleUrls: ['./edit-grades.component.scss']
})
export class EditGradesComponent implements OnInit {
  convertedDate: Date = new Date();
  displayOptions = false;
  constructor(
    public matDialogRef: MatDialogRef<EditGradesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Grade,
  ) {}

  ngOnInit(): void {
    if(this.data.date !== null) this.convertedDate = this.timestampToDate(this.data.date);
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

