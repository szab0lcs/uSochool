import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageLibraryComponent } from './manage-library.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageBooksComponent } from './manage-books/manage-books.component';
import { ManageBookDetailsComponent } from './manage-book-details/manage-book-details.component';
import { ManageRentedBooksComponent } from './manage-rented-books/manage-rented-books.component';



@NgModule({
  declarations: [
    ManageLibraryComponent,
    ManageBooksComponent,
    ManageBookDetailsComponent,
    ManageRentedBooksComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ManageLibraryModule { }
