import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageClassesComponent } from './manage-classes.component';
import { EditClassComponent } from './edit-class/edit-class.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ManageClassesComponent,
    EditClassComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ManageClassesModule { }
