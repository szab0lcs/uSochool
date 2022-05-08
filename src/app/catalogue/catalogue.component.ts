import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { NavigationService } from '../shared/services/navigation.service';
import { SubjectsComponent } from './subjects/subjects.component';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {

  studentSubjects = [
    {
      id: 'mathematics',
      title: 'Mathematics'
    },
    {
      id: 'history',
      title: 'History'
    },
    {
      id: 'english',
      title: 'English'
    },
    {
      id: 'geography',
      title: 'Geography'
    },
    {
      id: 'science',
      title: 'Science'
    },
    {
      id: 'informatics',
      title: 'Informatics'
    },
    {
      id: 'science',
      title: 'Science'
    },
  ]

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
