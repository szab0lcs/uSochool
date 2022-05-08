import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {
  dateFormat = 'YYYY MMMM D, H:mm';
  grades = [
    {
      grade: 9,
      date: moment().format(this.dateFormat)
    },
    {
      grade: 5,
      date: moment.unix(1632151164).format(this.dateFormat)
    },
    {
      grade: 8,
      date: moment().format(this.dateFormat)
    },
    {
      grade: 10,
      date: moment().format(this.dateFormat)
    },
  ]

  absences = [
    {
      date: moment.unix(1632151164).format(this.dateFormat),
      proven: true
    },
    {
      date: moment.unix(1628511984).format(this.dateFormat),
      proven: false
    },
    {
      date: moment.unix(1632151164).format(this.dateFormat),
      proven: false
    },
    {
      date: moment.unix(1628511984).format(this.dateFormat),
      proven: true
    },
  ]

  constructor(
    public matDialogRef: MatDialogRef<SubjectsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string, title:string },
  ) { }

  ngOnInit(): void {
  }

}
