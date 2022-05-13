import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentCatalogueComponent } from './student-catalogue/student-catalogue.component';
import { SharedModule } from '../shared/shared.module';
import { SubjectsComponent } from './subjects/subjects.component';
import { TeacherCatalogueComponent } from './teacher-catalogue/teacher-catalogue.component';
import { StudentsListComponent } from './teacher-catalogue/students-list/students-list.component';
import { SubjectsEditComponent } from './subjects-edit/subjects-edit.component';
import { EditGradesComponent } from './subjects-edit/edit-grades/edit-grades.component';
import { AddGradesComponent } from './subjects-edit/add-grades/add-grades.component';
import { AddAbsencesComponent } from './subjects-edit/add-absences/add-absences.component';



@NgModule({
  declarations: [
    StudentCatalogueComponent,
    TeacherCatalogueComponent,
    SubjectsComponent,
    StudentsListComponent,
    SubjectsEditComponent,
    EditGradesComponent,
    AddGradesComponent,
    AddAbsencesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class CataloguesModule { }
