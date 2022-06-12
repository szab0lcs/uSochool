import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Book, LibraryService } from 'src/app/shared/services/library.service';
import { AddBookComponent } from '../add-book/add-book.component';
import { ManageBookDetailsComponent } from '../manage-book-details/manage-book-details.component';


@Component({
  selector: 'app-manage-books',
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.scss']
})
export class ManageBooksComponent implements OnInit {
  timeout: NodeJS.Timeout | undefined;
  searchFilter: any = '';
  query = '';
  canAdd = false;
  books$: Observable<Book[]>;

  constructor(
    public matDialogRef: MatDialogRef<ManageBooksComponent>,
    public matDialog: MatDialog,
    private libraryService: LibraryService,
  ) {
    this.books$ = this.libraryService.getBooks$();
  }

  ngOnInit(): void {
  }

  onSearchChange(el: any): void {  
    if(this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.search(el), 250);
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
    dialogConfig.data = {book, rented: false};

    const dialog = this.matDialog.open(ManageBookDetailsComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();
  }

  addBook() {
    if (!this.canAdd) {
      this.canAdd = true;
      setTimeout(() => {
        this.canAdd = false;
      }, 3000);
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = 'forgot-password';
      dialogConfig.backdropClass = 'forgot-password-backdrop';
      dialogConfig.maxWidth = '100vw';

      this.matDialog.open(AddBookComponent, dialogConfig);
    }
  }
}