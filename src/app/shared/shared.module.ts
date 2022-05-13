import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './components/logo/logo.component';
import { PromptComponent } from './components/prompt/prompt.component';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { MyRentedBooksPipe } from './pipes/my-rented-books.pipe';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    LogoComponent,
    PromptComponent,
    FormatDatePipe,
    MyRentedBooksPipe,
    SearchFilterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    LogoComponent,
    PromptComponent,
    FormatDatePipe,
    MyRentedBooksPipe,
    SearchFilterPipe,
  ]
})
export class SharedModule { }
