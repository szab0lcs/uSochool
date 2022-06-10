import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { SubjectsComponent } from '../subjects/subjects.component';

@Component({
  selector: 'app-catalogue',
  templateUrl: './student-catalogue.component.html',
  styleUrls: ['./student-catalogue.component.scss']
})
export class StudentCatalogueComponent implements OnInit {

  // studentSubjects: Subject[] = [
  //   {
  //     id: 'mathematics',
  //     name: 'Mathematics'
  //   },
  //   {
  //     id: 'history',
  //     name: 'History'
  //   },
  //   {
  //     id: 'english',
  //     name: 'English'
  //   },
  //   {
  //     id: 'geography',
  //     name: 'Geography'
  //   },
  //   {
  //     id: 'science',
  //     name: 'Science'
  //   },
  //   {
  //     id: 'informatics',
  //     name: 'Informatics'
  //   },
  //   {
  //     id: 'science',
  //     name: 'Science'
  //   },
  // ]

  constructor(
    private navigationService: NavigationService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  back(): void {
    this.navigationService.back();
  }

  async openSubjectDetails(data: {id: string, title:string}) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = data;

    const dialog = this.matDialog.open(SubjectsComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();
  }
}
