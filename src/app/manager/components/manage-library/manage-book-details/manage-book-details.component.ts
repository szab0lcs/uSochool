import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from 'src/app/shared/services/library.service';

@Component({
  selector: 'app-manage-book-details',
  templateUrl: './manage-book-details.component.html',
  styleUrls: ['./manage-book-details.component.scss']
})
export class ManageBookDetailsComponent implements OnInit {
  constructor(
    public matDialogRef: MatDialogRef<ManageBookDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {book: Book, rented: boolean},
  ) { }

  ngOnInit(): void {
  }

  calculateAvailableDate(timestamp: number, rentedDays: number): number {
    const day = 86400
    return timestamp + (rentedDays * day)
  }
}
