import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { ISubject, ISubjectsWithTeachers } from 'src/app/shared/interfaces/catalogue';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { UserService } from 'src/app/shared/services/user.service';
import { StudentsListComponent } from './students-list/students-list.component';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-catalogue',
  templateUrl: './teacher-catalogue.component.html',
  styleUrls: ['./teacher-catalogue.component.scss']
})
export class TeacherCatalogueComponent implements OnInit {
  // teacherClasses: Classes[] = [
  //   {
  //     id: '2023_A',
  //     name: 'XI.A',
  //     subjects: [{
  //       id: 'mathematics',
  //       name: 'Mathematics'
  //     },
  //     {
  //       id: 'history',
  //       name: 'History'
  //     },
  //     {
  //       id: 'english',
  //       name: 'English'
  //     },]
  //   },
  //   {
  //     id: '2024_D',
  //     name: 'X.D',
  //     subjects: [{
  //       id: 'geography',
  //       name: 'Geography'
  //     },
  //     {
  //       id: 'science',
  //       name: 'Science'
  //     },
  //     {
  //       id: 'informatics',
  //       name: 'Informatics'
  //     },]
  //   },
  //   {
  //     id: '2025_A',
  //     name: 'IX.A',
  //     subjects: [{
  //       id: 'geography',
  //       name: 'Geography'
  //     },
  //     {
  //       id: 'science',
  //       name: 'Science'
  //     },
  //     {
  //       id: 'informatics',
  //       name: 'Informatics'
  //     },]
  //   },
  //   {
  //     id: '2022_C',
  //     name: 'XII.C',
  //     subjects: [{
  //       id: 'geography',
  //       name: 'Geography'
  //     },
  //     {
  //       id: 'science',
  //       name: 'Science'
  //     },
  //     {
  //       id: 'informatics',
  //       name: 'Informatics'
  //     },]
  //   },
  // ]
  teacherClasses$: Observable<{[key: string]: ISubjectsWithTeachers[]}> | undefined;
  show: number = -1;

  constructor(
    private navigationService: NavigationService,
    private matDialog: MatDialog,
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.teacherClasses$ = this.userService.getTeachersClasses$(userId)
        .pipe(
          map(classes =>  _.groupBy<ISubjectsWithTeachers>(classes, (c) => c.name)),
          map( _group => {
            let classes: {[key: string]: ISubjectsWithTeachers[]} = {};
            const keys = Object.keys(_group);
            keys.forEach(key => {
              const subject = _group[key]
              if (!classes[key]) classes[key] = [];
              classes[key] = subject;
            });
            return classes;
          }))
    }
  }

  back(): void {
    this.navigationService.back();
  }

  async openStudentsList(data: {className: string, classId: string, subject: ISubject}) {
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
