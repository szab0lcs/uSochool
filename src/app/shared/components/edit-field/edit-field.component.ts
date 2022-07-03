import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrls: ['./edit-field.component.scss']
})
export class EditFieldComponent implements OnInit {

  constructor(
    public matDialogRef: MatDialogRef<EditFieldComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditField,
  ) { }

  ngOnInit(): void {
  }

  edit(value: any) {
    this.matDialogRef.close(value);
  }

}

export interface EditField {
  title: string;
  type: InputAttribute;
  value: any;
}

export type InputAttribute = "number" | "text";
