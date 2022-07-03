import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ManageBooksComponent } from './manage-books/manage-books.component';
import { ManageRentedBooksComponent } from './manage-rented-books/manage-rented-books.component';

@Component({
  selector: 'app-library',
  templateUrl: './manage-library.component.html',
  styleUrls: ['./manage-library.component.scss']
})
export class ManageLibraryComponent implements OnInit {

  constructor(
    private navigationService: NavigationService,
    public matDialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  back(): void {
    this.navigationService.back();
  }

  async openBooks() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';

    const dialog = this.matDialog.open(ManageBooksComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();
  }

  async openRentedBooks() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';

    const dialog = this.matDialog.open(ManageRentedBooksComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();
  }
}
