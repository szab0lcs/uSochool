import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentCatalogueComponent } from './catalogues/student-catalogue/student-catalogue.component';
import { TeacherCatalogueComponent } from './catalogues/teacher-catalogue/teacher-catalogue.component';
import { HomeComponent } from './home/home.component';
import { LibraryComponent } from './library/library.component';
import { LoginComponent } from './login/login.component';
import { NewsComponent } from './news/news.component';
import { ProfileComponent } from './profile/profile.component';
import { TimetableComponent } from './timetable/timetable.component';

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
  },
  {
    path: 'news',
    component: NewsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'library',
    component: LibraryComponent
  },
  {
    path: 'timetable',
    component: TimetableComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export type ExistingRoutes = '' | 'home' | 'login' | 'student-catalogue' | 'teacher-catalogue' | 'news' | 'profile' | 'library' | 'timetable';
