import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ISubject } from 'src/app/shared/interfaces/catalogue';
import { IPerson } from 'src/app/shared/interfaces/user';
import { CatalogueService } from 'src/app/shared/services/catalogue.service';
import { SubjectsEditComponent } from '../../subjects-edit/subjects-edit.component';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {
  studentList$: Observable<IPerson[]> | undefined;
  constructor(
    private matDialog: MatDialog,
    public matDialogRef: MatDialogRef<StudentsListComponent>,
    private catalogueService: CatalogueService,
    @Inject(MAT_DIALOG_DATA) public data: {className: string, classId: string, subject: ISubject},
  ) { }

  ngOnInit(): void {
    this.studentList$ = this.catalogueService.getClassDoc$(this.data.classId)
      .pipe(map( classDoc => {
        let students: IPerson[] = [];
        if (classDoc) students = classDoc.students;
        return students;
      }))
  }

  async openSubjectDetails(data: {subject: ISubject, student: IPerson, classId: string}) {
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
