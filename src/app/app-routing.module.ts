import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentCatalogueComponent } from './catalogues/student-catalogue/student-catalogue.component';
import { TeacherCatalogueComponent } from './catalogues/teacher-catalogue/teacher-catalogue.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'student-catalogue',
    component: StudentCatalogueComponent
  },
  {
    path: 'teacher-catalogue',
    component: TeacherCatalogueComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
