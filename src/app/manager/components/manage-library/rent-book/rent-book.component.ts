import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AllUserData, PublicData } from 'src/app/shared/interfaces/user';
import { BookRental, LibraryService } from 'src/app/shared/services/library.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-rent-book',
  templateUrl: './rent-book.component.html',
  styleUrls: ['./rent-book.component.scss']
})
export class RentBookComponent implements OnInit {
  bookForm = new FormGroup({});
  users$: Observable<PublicData[] | null>;
  timeout: NodeJS.Timeout | undefined;
  query = '';
  constructor(
    public matDialogRef: MatDialogRef<RentBookComponent,BookRental>,
    @Inject(MAT_DIALOG_DATA) public maxRentPeriod: number,
    private userService: UserService,
  ) {
    this.users$ = this.userService.getAllUser$();
  }

  ngOnInit(): void {
    this.bookForm = new FormGroup({
      rentPeriod: new FormControl('', [Validators.required, Validators.min(1), Validators.max(this.maxRentPeriod)]),
      rentedBy: new FormControl('', [Validators.required, Validators.minLength(10)]),
    })
  }

  get rentPeriod() {
    return this.bookForm.get('rentPeriod');
  }

  get rentedBy() {
    return this.bookForm.get('rentedBy');
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

  onSubmit() {
    if (this.rentPeriod && this.rentedBy && this.rentPeriod.valid && this.rentedBy.valid) {
      const userData: PublicData = this.rentedBy.value;
      console.log({userData})
      this.matDialogRef.close({
        rentedDate: Timestamp.now(),
        rentPeriod: this.rentPeriod.value,
        rentedBy: {
          userId: userData.userId,
          name: userData.lastName + ' ' + userData.firstName
        }
      })
    }
  }
}
