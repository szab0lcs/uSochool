import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { IClass, ISubject, ISubjectsWithTeachers } from 'src/app/shared/interfaces/catalogue';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { UserService } from 'src/app/shared/services/user.service';
import { StudentsListComponent } from './students-list/students-list.component';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { CatalogueService } from 'src/app/shared/services/catalogue.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './teacher-catalogue.component.html',
  styleUrls: ['./teacher-catalogue.component.scss']
})
export class TeacherCatalogueComponent implements OnInit {
  teacherClasses$: Observable<{[key: string]: ISubjectsWithTeachers[]}> | undefined;
  headMasterClass$: Observable<IClass | undefined> | undefined;
  show: number = -1;
  showMaster = false;

  constructor(
    public navS: NavigationService,
    private matDialog: MatDialog,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private cataloguService: CatalogueService,
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
      this.userService.getClassIdIfHeadMaster(userId).then( masterClassId => {
        if (masterClassId) this.headMasterClass$ = this.cataloguService
        .getClassDoc$(masterClassId).pipe(map( classDoc => {
          if (classDoc) return classDoc;
          return undefined
        }))

      })
    }
  }

  back(): void {
    this.navS.back();
  }

  async openStudentsList(data: {className: string, classId: string, subject: ISubject, isMaster: boolean}) {
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
