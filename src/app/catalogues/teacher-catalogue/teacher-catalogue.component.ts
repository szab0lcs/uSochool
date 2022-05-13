import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { Classes, Subject } from '../catalogue-types';
import { SubjectsComponent } from '../subjects/subjects.component';
import { StudentsListComponent } from './students-list/students-list.component';

@Component({
  selector: 'app-catalogue',
  templateUrl: './teacher-catalogue.component.html',
  styleUrls: ['./teacher-catalogue.component.scss']
})
export class TeacherCatalogueComponent implements OnInit {
  teacherClasses: Classes[] = [
    {
      id: '2023_A',
      name: 'XI.A',
      subjects: [{
        id: 'mathematics',
        name: 'Mathematics'
      },
      {
        id: 'history',
        name: 'History'
      },
      {
        id: 'english',
        name: 'English'
      },]
    },
    {
      id: '2024_D',
      name: 'X.D',
      subjects: [{
        id: 'geography',
        name: 'Geography'
      },
      {
        id: 'science',
        name: 'Science'
      },
      {
        id: 'informatics',
        name: 'Informatics'
      },]
    },
    {
      id: '2025_A',
      name: 'IX.A',
      subjects: [{
        id: 'geography',
        name: 'Geography'
      },
      {
        id: 'science',
        name: 'Science'
      },
      {
        id: 'informatics',
        name: 'Informatics'
      },]
    },
    {
      id: '2022_C',
      name: 'XII.C',
      subjects: [{
        id: 'geography',
        name: 'Geography'
      },
      {
        id: 'science',
        name: 'Science'
      },
      {
        id: 'informatics',
        name: 'Informatics'
      },]
    },
  ]
  show: number = -1;

  constructor(
    private navigationService: NavigationService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  back(): void {
    this.navigationService.back();
  }

  async openStudentsList(data: {className: string, classId: string, subject: Subject}) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = data;

    const dialog = this.matDialog.open(StudentsListComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();
  }

  toggleExpandable(i: number){
    if (this.show === i) {
      this.show = -1;
      return;
    }
    this.show = i;
  }
}
