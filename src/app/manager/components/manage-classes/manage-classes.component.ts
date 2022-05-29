import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { IClass, romanNumbers } from 'src/app/shared/interfaces/catalogue';
import { CatalogueService } from 'src/app/shared/services/catalogue.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { AddClassComponent } from './add-class/add-class.component';
import { EditClassComponent } from './edit-class/edit-class.component';

@Component({
  selector: 'app-manage-classes',
  templateUrl: './manage-classes.component.html',
  styleUrls: ['./manage-classes.component.scss']
})
export class ManageClassesComponent implements OnInit {
  classesList$: Observable<{
    IX: IClass[],
    X: IClass[],
    XI: IClass[],
    XII: IClass[],
  }> | undefined;
  show: number = -1;
  canAddClass = false;
  constructor(
    private navigationService: NavigationService,
    private matDialog: MatDialog,
    private catalogueService: CatalogueService,
  ) { }

  ngOnInit(): void {
    // this.catalogueService.addStudentToClass({id: 'KNzWmMwYhJYusFNf0xbq9GvH30t1',firstName: 'Alexandra', lastName: 'Dunn'},'2022_B');
    this.catalogueService.getEligibleStudentForClass(2024).subscribe( students => console.log({students}))
    this.classesList$ = this.catalogueService.getAllClasses().pipe(map( classes => {
      const sortedClasses: {
        IX: IClass[], X: IClass[], XI: IClass[], XII: IClass[]
        } = { 
        IX: [], X: [], XI: [],XII: [] 
      }

      for (const oneClass of classes) {
        if(oneClass && oneClass.name) {
          const nameAndId: string[] = oneClass.name.split('.')
          sortedClasses[nameAndId[0] as romanNumbers].push(oneClass);
        }
      }
      return sortedClasses;
    }))
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
