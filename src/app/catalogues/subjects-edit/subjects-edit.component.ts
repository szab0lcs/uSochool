import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { Grade, Student, Subject } from '../catalogue-types';
import { EditGradesComponent } from './edit-grades/edit-grades.component';

@Component({
  selector: 'app-subjects-edit',
  templateUrl: './subjects-edit.component.html',
  styleUrls: ['./subjects-edit.component.scss']
})
export class SubjectsEditComponent implements OnInit {
  dateFormat = 'YYYY MMMM D';
  grades: Grade[] = [
    {
      id: '123456789',
      value: 9,
      date: 1628511984
    },
    {
      id: '123456789',
      value: 5,
      date: 1632151164
    },
    {
      id: '123456789',
      value: 8,
      date: 1625833584
    },
    {
      id: '123456789',
      value: 10,
      date: 1625747184
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
  editableAbsences = false;

  constructor(
    private matDialog: MatDialog,
    public matDialogRef: MatDialogRef<SubjectsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {subject: Subject, student: Student},
  ) { }

  ngOnInit(): void {
  }

  async editGrade(grade: Grade) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = grade;

    const dialog = this.matDialog.open(EditGradesComponent,dialogConfig);
    const value = await dialog.afterClosed().pipe(take(1)).toPromise();
    console.log({value});
    
    
  }
  
  addGrade() {
    
  }
  
  editAbsences() {
    this.editableAbsences = true;

  }

  addAbsence() {

  }

  formatDate(value: number | null) {
    if (value === null) return;
    return moment.unix(value).format(this.dateFormat);
  }
  
}
