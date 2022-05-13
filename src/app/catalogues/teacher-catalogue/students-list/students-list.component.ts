import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Student, Subject } from '../../catalogue-types';
import { SubjectsEditComponent } from '../../subjects-edit/subjects-edit.component';
import { SubjectsComponent } from '../../subjects/subjects.component';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {
  studentList: Student[] = [
    {
      id: '123456',
      name: 'July Calleigh'
    },
    {
      id: '123456',
      name: 'Philander Lindsie'
    },
    {
      id: '123456',
      name: 'Roswell Ash'
    },
    {
      id: '123456',
      name: 'Mona Derby'
    },
    {
      id: '123456',
      name: 'Angelica Jarred'
    },
  ]
  constructor(
    private matDialog: MatDialog,
    public matDialogRef: MatDialogRef<StudentsListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {className: string, classId: string, subject: Subject},
  ) { }

  ngOnInit(): void {
  }

  async openSubjectDetails(data: {subject: Subject, student: Student}) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = data;

    const dialog = this.matDialog.open(SubjectsEditComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();
  }
}
