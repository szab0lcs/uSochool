import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, OperatorFunction, pipe, UnaryFunction } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { ISubject, ISubjectsWithTeachers } from 'src/app/shared/interfaces/catalogue';
import { AllUserData } from 'src/app/shared/interfaces/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CatalogueService } from 'src/app/shared/services/catalogue.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SubjectsComponent } from '../subjects/subjects.component';

@Component({
  selector: 'app-catalogue',
  templateUrl: './student-catalogue.component.html',
  styleUrls: ['./student-catalogue.component.scss']
})
export class StudentCatalogueComponent implements OnInit {
  user$: Observable<AllUserData | null>;
  userSubjects$: Observable<ISubjectsWithTeachers[] | null>;
  constructor(
    private navigationService: NavigationService,
    private matDialog: MatDialog,
    private userService: UserService,
    private authService: AuthService,
    private cataloguService: CatalogueService,
  ) { 
    this.user$ = this.userService.currentUser$;
    this.userSubjects$ = this.user$.pipe(
      map(user => user && user.publicData.classId ? user.publicData.classId : null),
      this.filterNullish(),
      switchMap((classId) => {
        return this.cataloguService.getClassDoc$(classId)
          .pipe(map( classDoc => classDoc ? classDoc.subjects : null))
      })
    )
  }

  filterNullish<T>(): UnaryFunction<Observable<T | null | undefined>, Observable<T>> {
    return pipe(
      filter(x => x != null) as OperatorFunction<T | null |  undefined, T>
    );
  }

  ngOnInit(): void {
  }

  back(): void {
    this.navigationService.back();
  }

  async openSubjectDetails(data: ISubjectsWithTeachers) {
    const userData = await this.user$.pipe(take(1)).toPromise();
    if (!userData) return;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = {subject: data, userId: userData.publicData.userId};

    const dialog = this.matDialog.open(SubjectsComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();
  }
}
