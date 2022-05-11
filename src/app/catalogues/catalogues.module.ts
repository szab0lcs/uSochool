import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentCatalogueComponent } from './student-catalogue/student-catalogue.component';
import { SharedModule } from '../shared/shared.module';
import { SubjectsComponent } from './subjects/subjects.component';
import { TeacherCatalogueComponent } from './teacher-catalogue/teacher-catalogue.component';
import { StudentsListComponent } from './teacher-catalogue/students-list/students-list.component';
import { SubjectsEditComponent } from './subjects-edit/subjects-edit.component';
import { EditGradesComponent } from './subjects-edit/edit-grades/edit-grades.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddGradesComponent } from './subjects-edit/add-grades/add-grades.component';



@NgModule({
  declarations: [
    StudentCatalogueComponent,
    TeacherCatalogueComponent,
    SubjectsComponent,
    StudentsListComponent,
    SubjectsEditComponent,
    EditGradesComponent,
    AddGradesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CataloguesModule { }
