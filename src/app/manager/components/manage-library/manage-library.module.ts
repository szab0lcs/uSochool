import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageLibraryComponent } from './manage-library.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageBooksComponent } from './manage-books/manage-books.component';
import { ManageBookDetailsComponent } from './manage-book-details/manage-book-details.component';
import { ManageRentedBooksComponent } from './manage-rented-books/manage-rented-books.component';
import { AddBookComponent } from './add-book/add-book.component';
import { FormsModule } from '@angular/forms';
import { RentBookComponent } from './rent-book/rent-book.component';



@NgModule({
  declarations: [
    ManageLibraryComponent,
    ManageBooksComponent,
    ManageBookDetailsComponent,
    ManageRentedBooksComponent,
    AddBookComponent,
    RentBookComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
  ]
})
export class ManageLibraryModule { }
