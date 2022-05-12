import { Injectable } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { PromptComponent } from '../components/prompt/prompt.component';

@Injectable({ providedIn: 'root' })
export class PromptService {

  constructor(
    private matDialog: MatDialog,
  ) {
  }

  async promptForConfirmation<T>(
    options: MatDialogConfig, 
    promptOptions: PromptOptions = INITIAL_PROMPT_OPTIONS
    ): Promise<T | undefined> {
    const prompt = this.matDialog.open(PromptComponent, options);
    if(promptOptions.autoClose) {
        setTimeout(() => {
            prompt.close()
        }, 1000 * promptOptions.autoClose);
    }
    const afterClosedData = await prompt.afterClosed().pipe(take(1)).toPromise() as T;
    return afterClosedData;
  }
}

export interface PromptOptions {
  autoClose: number;
}

export const INITIAL_PROMPT_OPTIONS: PromptOptions = {
  autoClose: 0,
}
