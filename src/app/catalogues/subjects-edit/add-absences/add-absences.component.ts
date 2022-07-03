import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-add-absences',
  templateUrl: './add-absences.component.html',
  styleUrls: ['./add-absences.component.scss']
})
export class AddAbsencesComponent implements OnInit {
  gradeDate: Date = new Date();

  constructor(
    public matDialogRef: MatDialogRef<AddAbsencesComponent>,
  ) {}

  ngOnInit(): void {}

  dateChangeHandler(date: Date){
    this.gradeDate = date;
  }

  add() {
    this.matDialogRef.close(Timestamp.fromDate(this.gradeDate));
  }
}

