import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from '../library.component';

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

  calculateAvailableDate(timestamp: number, rentedDays: number): number {
    const day = 86400
    return timestamp + (rentedDays * day)
  }
}
