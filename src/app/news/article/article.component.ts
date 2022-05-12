import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Article } from '../news.component';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public article: Article,
  ) { }

  ngOnInit(): void {
  }

  getBackgroundUrl(imageUrl: string) {
    return {'background-image': `url('${imageUrl}')`};
  }

}
