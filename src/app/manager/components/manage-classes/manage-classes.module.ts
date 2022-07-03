import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageClassesComponent } from './manage-classes.component';
import { EditClassComponent } from './edit-class/edit-class.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddClassComponent } from './add-class/add-class.component';
import { AddStudentsComponent } from './edit-class/add-students/add-students.component';
import { RemoveStudentsComponent } from './edit-class/remove-students/remove-students.component';
import { AddSubjectComponent } from './edit-class/add-subject/add-subject.component';
import { RemoveSubjectsComponent } from './edit-class/remove-subjects/remove-subjects.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ManageClassesComponent,
    EditClassComponent,
    AddClassComponent,
    AddStudentsComponent,
    RemoveStudentsComponent,
    AddSubjectComponent,
    RemoveSubjectsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ]
})
export class ManageClassesModule { }
