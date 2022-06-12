import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import * as moment from 'moment';
import { Book } from 'src/app/shared/services/library.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  constructor(
    public matDialogRef: MatDialogRef<BookDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {book: Book, rented: boolean},
  ) { }

  ngOnInit(): void {
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
