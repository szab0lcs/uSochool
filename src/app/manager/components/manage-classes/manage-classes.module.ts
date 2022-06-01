import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageClassesComponent } from './manage-classes.component';
import { EditClassComponent } from './edit-class/edit-class.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddClassComponent } from './add-class/add-class.component';
import { AddStudentsComponent } from './edit-class/add-students/add-students.component';
import { RemoveStudentsComponent } from './edit-class/remove-students/remove-students.component';



@NgModule({
  declarations: [
    ManageClassesComponent,
    EditClassComponent,
    AddClassComponent,
    AddStudentsComponent,
    RemoveStudentsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ManageClassesModule { }
