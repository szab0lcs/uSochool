import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Grade } from '../../catalogue-types';

@Component({
  selector: 'app-edit-grades',
  templateUrl: './edit-grades.component.html',
  styleUrls: ['./edit-grades.component.scss']
})
export class EditGradesComponent implements OnInit {
  convertedDate: Date;
  form: FormGroup = new FormGroup({});
  constructor(
    public matDialogRef: MatDialogRef<EditGradesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Grade,
  ) { 
    this.convertedDate = this.timestampToDate(data.date);
  }

  ngOnInit(): void {
    console.log({converted: this.convertedDate});
    
    this.form = new FormGroup({
      date: new FormControl('08/01/2019')
    });
  }

  timestampToDate(value: number) {
    return new Date(moment.unix(value).format('MM/DD/YYYY'));
  }

  dateChangeHandler(date: Date){
    const stringDate: string = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    // this.form.get('date').setValue(stringDate)
  }

  minusGrade() {
    if(this.data.value === 1) return;
    this.data.value = this.data.value - 1;
  }
  
  plusGrade() {
    if(this.data.value === 10) return;
    this.data.value = this.data.value + 1;
  }
}

