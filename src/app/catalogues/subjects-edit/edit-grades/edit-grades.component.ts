import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import * as moment from 'moment';
import { IGrade } from 'src/app/shared/interfaces/catalogue';

@Component({
  selector: 'app-edit-grades',
  templateUrl: './edit-grades.component.html',
  styleUrls: ['./edit-grades.component.scss']
})
export class EditGradesComponent implements OnInit {
  gradeDate: Date = new Date();
  gradeTimestamp = Timestamp.now();
  displayOptions = false;
  gradeValue: number = 0;
  constructor(
    public matDialogRef: MatDialogRef<EditGradesComponent, {grade: IGrade, action: 'edit' | 'delete'}>,
    @Inject(MAT_DIALOG_DATA) public data: IGrade,
  ) {}

  ngOnInit(): void {
    if(this.data.date !== null) {
      this.gradeDate = this.formatDate(this.data.date);
      this.gradeTimestamp = Timestamp.fromDate(this.gradeDate);
    }
    if(this.data.grade !== null) this.gradeValue = this.data.grade;
  }

  formatDate(value: Timestamp) {
    return value.toDate();
  }

  dateChangeHandler(date: Date){
    this.gradeDate = date;
    this.gradeTimestamp = Timestamp.fromDate(date);
  }

  minusGrade() {
    if(this.gradeValue === 1 || this.gradeValue === null) return;
    this.gradeValue = this.gradeValue - 1;
  }
  
  plusGrade() {
    if(this.gradeValue === 10 || this.gradeValue === null) return;
    this.gradeValue = this.gradeValue + 1;
  }

  save() {
    this.matDialogRef.close(
      {
        grade: {
          ...this.data,
          grade: this.gradeValue,
          date: this.gradeTimestamp
        },
        action: 'edit'
      });
  }

  deleteThis() {
    this.matDialogRef.close(
      {
        grade: this.data,
        action: 'delete'
      });
  }
}

