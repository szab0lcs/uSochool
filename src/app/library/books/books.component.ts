import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Book, LibraryService } from 'src/app/shared/services/library.service';
import { BookDetailsComponent } from '../book-details/book-details.component';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  timeout: NodeJS.Timeout | undefined;
  searchFilter: any = '';
  query = '';
  books$: Observable<Book[]> | undefined;

  constructor(
    public matDialogRef: MatDialogRef<BooksComponent>,
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

    const dialog = this.matDialog.open(BookDetailsComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();
  }
}