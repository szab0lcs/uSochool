import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { CataloguesModule } from './catalogues/catalogues.module';
import { NewsComponent } from './news/news.component';
import { ArticleComponent } from './news/article/article.component';
import { ProfileComponent } from './profile/profile.component';
import { LibraryComponent } from './library/library.component';
import { BooksComponent } from './library/books/books.component';
import { RentedBooksComponent } from './library/rented-books/rented-books.component';
import { SearchFilterPipe } from './pipes/search-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ForgotPasswordComponent,
    NewsComponent,
    ArticleComponent,
    ProfileComponent,
    LibraryComponent,
    BooksComponent,
    RentedBooksComponent,
    SearchFilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    CataloguesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
