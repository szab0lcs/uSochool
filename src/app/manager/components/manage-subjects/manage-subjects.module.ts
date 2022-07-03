import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubjectsComponent } from './subjects/subjects.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { ManageSubjectsComponent } from './manage-subjects.component';



@NgModule({
  declarations: [
    SubjectsComponent,
    ProfilesComponent,
    ManageSubjectsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ManageSubjectsModule { }
