import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BookDetailsComponent } from './book-details/book-details.component';
import { BooksComponent } from './books/books.component';
import { LibraryComponent } from './library.component';
import { RentedBooksComponent } from './rented-books/rented-books.component';



@NgModule({
  declarations: [
    LibraryComponent,
    BooksComponent,
    RentedBooksComponent,
    BookDetailsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class LibraryModule {}
