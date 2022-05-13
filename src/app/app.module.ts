import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CataloguesModule } from './catalogues/catalogues.module';
import { LibraryModule } from './library/library.module';
import { NewsModule } from './news/news.module';
import { LoginModule } from './login/login.module';
import { HomeModule } from './home/home.module';
import { ProfileModule } from './profile/profile.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    CataloguesModule,
    LibraryModule,
    NewsModule,
    LoginModule,
    HomeModule,
    ProfileModule
  ],
  providers: [],
  exports: [SharedModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
