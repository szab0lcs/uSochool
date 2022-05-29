import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { AddClassComponent } from './add-class/add-class.component';
import { EditClassComponent } from './edit-class/edit-class.component';

@Component({
  selector: 'app-manage-classes',
  templateUrl: './manage-classes.component.html',
  styleUrls: ['./manage-classes.component.scss']
})
export class ManageClassesComponent implements OnInit {
  classesList = [
    {
      schoolGrade: 'IX',
      classes: ['A','B','C','D']
    },
    {
      schoolGrade: 'X',
      classes: ['A','B','C']
    },
    {
      schoolGrade: 'XI',
      classes: ['A','B','C','D']
    },
    {
      schoolGrade: 'XII',
      classes: ['A','B','C','D']
    },
  ]
  show: number = -1;
  canAddClass = false;
  constructor(
    private navigationService: NavigationService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  back(): void {
    this.navigationService.back();
  }

  async openStudentsList(data: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = data;

    const dialog = this.matDialog.open(EditClassComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();
  }

  toggleExpandable(i: number){
    if (this.show === i) {
      this.show = -1;
      return;
    }
    this.show = i;
  }

  async addClass(){
    if (!this.canAddClass) {
      this.canAddClass = true;
      setTimeout(() => {
        this.canAddClass = false;
      }, 5000);
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = 'forgot-password';
      dialogConfig.backdropClass = 'forgot-password-backdrop';
      dialogConfig.maxWidth = '100vw';

      const dialog = this.matDialog.open(AddClassComponent,dialogConfig);
      await dialog.afterClosed().pipe(take(1)).toPromise();
    }
  }

}
