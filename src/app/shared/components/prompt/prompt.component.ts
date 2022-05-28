import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {
  hideCancel = false;
  constructor(
    public matDialogRef: MatDialogRef<PromptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.extraData && this.data.extraData.hideCancel) this.hideCancel = true;
    
  }
}

export interface DialogData {
  title?: string;
  text?: string;
  cancelButton?: string;
  okButton?: string;
  extraData?: {
    booleanValue?: boolean;
    hideCancel?: boolean;
  };
}
