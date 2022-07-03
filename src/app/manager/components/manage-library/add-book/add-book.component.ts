import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LibraryService } from 'src/app/shared/services/library.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {
  bookForm = new FormGroup({});
  constructor(
    public matDialogRef: MatDialogRef<AddBookComponent>,
    private libraryService: LibraryService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.bookForm = new FormGroup({
      title: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required),
      maxRentPeriod: new FormControl('',[Validators.required, Validators.min(15), Validators.max(90)]),
      isbn: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]),
    })
  }

  get title() {
    return this.bookForm.get('title');
  }

  get author() {
    return this.bookForm.get('author');
  }

  get maxRentPeriod() {
    return this.bookForm.get('maxRentPeriod');
  }

  get isbn() {
    return this.bookForm.get('isbn');
  }

  onSubmit() {
    if (!(this.bookForm.valid && this.title && this.author && this.maxRentPeriod && this.isbn)) return;
    this.libraryService.addBook({
      title: this.title.value,
      author: this.author.value,
      maxRentPeriod: this.maxRentPeriod.value,
      isbn: this.isbn.value
    }).then(() => {
      this.toastr.success('Book successfully added!',`Book Create`,{
        positionClass: 'toast-bottom-center',
      });
      this.bookForm.reset();
    })
    .catch( error => {
      this.toastr.error(error,`Book Create`,{
        positionClass: 'toast-bottom-center',
      });
    })
  }
}
