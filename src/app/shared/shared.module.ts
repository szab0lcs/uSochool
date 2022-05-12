import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './components/logo/logo.component';
import { PromptComponent } from './components/prompt/prompt.component';



@NgModule({
  declarations: [
    LogoComponent,
    PromptComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LogoComponent
  ]
})
export class SharedModule { }
