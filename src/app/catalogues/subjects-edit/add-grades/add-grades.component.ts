import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { GradeType, IGrade, INITIAL_GRADE_VALUE } from 'src/app/shared/interfaces/catalogue';

@Component({
  selector: 'app-add-grades',
  templateUrl: './add-grades.component.html',
  styleUrls: ['./add-grades.component.scss']
})
export class AddGradesComponent implements OnInit {
  gradeDate: Date = new Date();
  data: IGrade = INITIAL_GRADE_VALUE;
  displayOptions = false;
  gradeType$ = new BehaviorSubject<GradeType>('general');
  constructor(
    public matDialogRef: MatDialogRef<AddGradesComponent>,
    @Inject(MAT_DIALOG_DATA) public canAddSemester: boolean,
  ) {}

  ngOnInit(): void {
  }

  dateChangeHandler(date: Date){
    this.gradeDate = date;
    this.data.date = Timestamp.fromDate(date);
  }

  minusGrade() {
    if(this.data.grade === 1 || this.data.grade === null) return;
    this.data.grade = this.data.grade - 1;
  }
  
  plusGrade() {
    if(this.data.grade === 10 || this.data.grade === null) return;
    this.data.grade = this.data.grade + 1;
  }

  save() {
    this.matDialogRef.close({
      ...this.data,
      type: this.gradeType$.value,
    });
  }

  switchGradeType(){
    if (this.gradeType$.value === 'general') this.gradeType$.next('periodal');
    else this.gradeType$.next('general');
  }
}

