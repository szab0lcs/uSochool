import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { take } from 'rxjs/operators';
import { InputAttribute } from 'src/app/shared/components/edit-field/edit-field.component';
import { DialogData } from 'src/app/shared/components/prompt/prompt.component';
import { EditFieldService } from 'src/app/shared/services/edit-field.service';
import { Book, BookRental, LibraryService } from 'src/app/shared/services/library.service';
import { PromptService } from 'src/app/shared/services/prompt.service';
import { RentBookComponent } from '../rent-book/rent-book.component';
import * as moment from 'moment';
import { UserService } from 'src/app/shared/services/user.service';
import { Observable } from 'rxjs';
import { AllUserData } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-manage-book-details',
  templateUrl: './manage-book-details.component.html',
  styleUrls: ['./manage-book-details.component.scss']
})
export class ManageBookDetailsComponent {
  constructor(
    public matDialogRef: MatDialogRef<ManageBookDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {book: Book, rented: boolean},
    public editFieldService: EditFieldService,
    private libraryService: LibraryService,
    private promptService: PromptService,
    private matDialog: MatDialog,
  ) { }

  async edit(title: string, type: InputAttribute, field: 'title' | 'author' | 'isbn' | 'maxRentPeriod') {
    const value = await this.editFieldService.edit({title, type, value: this.data.book[field]});
    if (field !== 'maxRentPeriod') {
      this.data.book[field] = value + '';
    } else {
      this.data.book[field] = +value;
    }
  }
  
  save() {
    this.libraryService.editBook(this.data.book);
  }

  async deleteBook() {
    if (!this.data.book.id) return;
    const dialogConfig = new MatDialogConfig<DialogData>();
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = 'forgot-password';
      dialogConfig.backdropClass = 'forgot-password-backdrop';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.data = {
        title: 'Delete',
        text: 'Do you want to delete this book?',
        okButton: 'Yes',
        cancelButton: 'No'
      };
    const confirmation = await this.promptService.promptForConfirmation<boolean>(dialogConfig);
    if (!confirmation) return;
    this.libraryService.removeBook(this.data.book.id);
    this.matDialogRef.close();
  }
  
  async rentBook() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = this.data.book.maxRentPeriod;

    const dialog = this.matDialog.open<RentBookComponent,number,BookRental>(RentBookComponent,dialogConfig);
    const res = await dialog.afterClosed().pipe(take(1)).toPromise();
    if (!res) return;
    await this.libraryService.rentBook(this.data.book, res);
    this.matDialogRef.close();
  }

  async returnBook() {
    const dialogConfig = new MatDialogConfig<DialogData>();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = {
      title: 'Delete',
      text: 'Do you want to return this book?',
      okButton: 'Yes',
      cancelButton: 'No'
    };
    const confirmation = await this.promptService.promptForConfirmation<boolean>(dialogConfig);
    if (!confirmation) return;
    await this.libraryService.returnBook(this.data.book);
    this.matDialogRef.close();
  }

  calculateAvailableDate(timestamp: Timestamp, rentedDays: number) {
    const date = timestamp.toDate();
    const available = this.addDays(date,rentedDays);
    return moment(available).format('YYYY MMMM D');
  }

  addDays(date: Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
