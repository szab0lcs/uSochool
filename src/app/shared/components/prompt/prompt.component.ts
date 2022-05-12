import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {

  constructor(
    public matDialogRef: MatDialogRef<PromptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
    console.log({data: this.data});
    
  }
}

export interface DialogData {
  title?: string;
  text?: string;
  cancelButton?: string;
  okButton?: string;
  extraData?: {
    booleanValue?: boolean;
  };
}
