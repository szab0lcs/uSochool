import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { EditField, EditFieldComponent } from '../components/edit-field/edit-field.component';

@Injectable({
  providedIn: 'root'
})
export class EditFieldService {

  constructor(
    private matDialog: MatDialog,
  ) { }

  edit(data: EditField) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = data;

    const dialog = this.matDialog.open(EditFieldComponent,dialogConfig);
    return dialog.afterClosed().pipe(take(1)).toPromise();
  }
}
