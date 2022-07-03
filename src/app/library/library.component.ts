import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { NavigationService } from '../shared/services/navigation.service';
import { BooksComponent } from './books/books.component';
import { RentedBooksComponent } from './rented-books/rented-books.component';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

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

    const dialog = this.matDialog.open(BooksComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();
  }

  async openRentedBooks() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';

    const dialog = this.matDialog.open(RentedBooksComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();
  }
}
