import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageClassesComponent } from './manage-classes.component';
import { EditClassComponent } from './edit-class/edit-class.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddClassComponent } from './add-class/add-class.component';



@NgModule({
  declarations: [
    ManageClassesComponent,
    EditClassComponent,
    AddClassComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ManageClassesModule { }
