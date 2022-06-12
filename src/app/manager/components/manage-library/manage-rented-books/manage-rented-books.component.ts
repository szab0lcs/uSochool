import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Book, LibraryService } from 'src/app/shared/services/library.service';
import { ManageBookDetailsComponent } from '../manage-book-details/manage-book-details.component';

@Component({
  selector: 'app-manage-rented-books',
  templateUrl: './manage-rented-books.component.html',
  styleUrls: ['./manage-rented-books.component.scss']
})
export class ManageRentedBooksComponent implements OnInit {
  private timeout?: number;
  searchFilter: any = '';
  query = '';
  userId = 'myUserID';
  books$: Observable<Book[]>;

  constructor(
    public matDialogRef: MatDialogRef<ManageRentedBooksComponent>,
    public matDialog: MatDialog,
    private libraryService: LibraryService,
  ) {
    this.books$ = this.libraryService.getBooks$();
  }

  ngOnInit(): void {
  }

  onSearchChange(el: any): void {  
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => this.search(el), 250);
  }
  
  search(el: any){
    const target = el? el.target : undefined;
    const value = target && target.value ? target.value : '';
    this.query = value;
  }

  async openBookDetails(book: Book) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = {book, rented: true};

    const dialog = this.matDialog.open(ManageBookDetailsComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();
  }
}
