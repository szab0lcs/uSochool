import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Book } from 'src/app/shared/services/library.service';
import { BookDetailsComponent } from '../book-details/book-details.component';


@Component({
  selector: 'app-rented-books',
  templateUrl: './rented-books.component.html',
  styleUrls: ['./rented-books.component.scss']
})
export class RentedBooksComponent implements OnInit {
  private timeout?: number;
  searchFilter: any = '';
  query = '';
  userId = 'myUserID';
  books: Book[] = [];
  // books: Book[] = [
  //   {
  //     id: 'asd123',
  //     title: 'Lorem ipsum dolor sit abc',
  //     author: 'Example Author',
  //     maxRentPeriod: 30,
  //     available: true,
  //     isbn: '9496518465146854324564',
  //   },
  //   {
  //     id: 'asd6347823123',
  //     title: 'Lorem ipsum zzz',
  //     author: 'Example Author',
  //     maxRentPeriod: 30,
  //     available: true,
  //     isbn: '9496518465146854324564',
  //   },
  //   {
  //     id: 'asddfefw123',
  //     title: 'Lorem ipsum dolor',
  //     author: 'Example Szerzo',
  //     maxRentPeriod: 60,
  //     available: {
  //       rentPeriod: 20,
  //       rentedDate: 1651901856,
  //       rentedBy: 'myUserID'
  //     },
  //     isbn: '9496518465146854324564',
  //   },
  //   {
  //     id: 'asdr32d123',
  //     title: 'Lorem ipsum sit',
  //     author: 'Example Author',
  //     maxRentPeriod: 30,
  //     available: {
  //       rentPeriod: 20,
  //       rentedDate: 1651901856,
  //       rentedBy: 'otherUserID'
  //     },
  //     isbn: '9496518465146854324564',
  //   },
  //   {
  //     id: 'asdf32f3d123',
  //     title: 'Lorem ipsum dolor sit amet',
  //     author: 'Pelda Author',
  //     maxRentPeriod: 60,
  //     available: true,
  //     isbn: '9496518465146854324564',
  //   },
  //   {
  //     id: 'af34f4fsd123',
  //     title: 'Lorem dolor sit',
  //     author: 'Example Author',
  //     maxRentPeriod: 30,
  //     available: {
  //       rentPeriod: 20,
  //       rentedDate: 1651901856,
  //       rentedBy: 'myUserID'
  //     },
  //     isbn: '9496518465146854324564',
  //   },

  // ]

  constructor(
    public matDialogRef: MatDialogRef<RentedBooksComponent>,
    public matDialog: MatDialog,
  ) { }

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

    const dialog = this.matDialog.open(BookDetailsComponent,dialogConfig);
    await dialog.afterClosed().pipe(take(1)).toPromise();
  }
}
