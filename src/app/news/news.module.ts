import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from './news.component';
import { ArticleComponent } from './article/article.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    NewsComponent,
    ArticleComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class NewsModule { }
