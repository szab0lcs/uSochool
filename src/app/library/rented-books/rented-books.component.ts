import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable, OperatorFunction, pipe, UnaryFunction } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { Book, LibraryService } from 'src/app/shared/services/library.service';
import { UserService } from 'src/app/shared/services/user.service';
import { BookDetailsComponent } from '../book-details/book-details.component';


@Component({
  selector: 'app-rented-books',
  templateUrl: './rented-books.component.html',
  styleUrls: ['./rented-books.component.scss']
})
export class RentedBooksComponent implements OnInit {
  timeout: NodeJS.Timeout | undefined;
  searchFilter: any = '';
  query = '';
  books$: Observable<Book[]> | undefined;
  userId$: Observable<string | undefined>;

  constructor(
    public matDialogRef: MatDialogRef<RentedBooksComponent>,
    public matDialog: MatDialog,
    private libraryService: LibraryService,
    private userService: UserService,
    ) {
      this.userId$ = this.userService.userId$;
   }

  ngOnInit(): void {
    this.books$ = this.userId$.pipe(
      map( (uid) => uid ? uid : null),
      this.filterNullish(),
      switchMap( (userID) => {
        return this.libraryService.getUserBooks$(userID);
      })
    )
  }

  filterNullish<T>(): UnaryFunction<Observable<T | null | undefined>, Observable<T>> {
    return pipe(
      filter(x => x != null) as OperatorFunction<T | null |  undefined, T>
    );
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
    dialogConfig.data = {book, rented: true};

    const dialog = this.matDialog.open(BookDetailsComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();
  }
}
