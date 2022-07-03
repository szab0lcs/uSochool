import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { NavigationService } from '../shared/services/navigation.service';
import { ArticleComponent } from './article/article.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  articles: Article[] = [
    {
      id: 'xyz',
      date: 1632151164,
      imageUrl: 'assets/images/news.jpg',
      title: 'Lorem ipsum dolor',
      shortDescription: 'Lorem ipsum dolor sit amet, adipisicing elit.',
      text: 'Lorem ipsum dolor sit amet consectetur <br> adipisicing elit. In quaerat, cum quos quibusdam autem inventore repellendus ipsum est nemo facere corrupti quidem rem dignissimos dolore facilis ab debitis omnis. Magnam quisquam veritatis vitae quo, recusandae, dolorem ut facere incidunt quibusdam excepturi eum, vel sunt. Quis architecto quo optio necessitatibus at!'
    },
    {
      id: 'xyz',
      date: 1632151164,
      imageUrl: 'assets/images/news.jpg',
      title: 'Lorem ipsum dolor',
      shortDescription: 'Lorem ipsum dolor sit amet, adipisicing elit.',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. In quaerat, cum quos quibusdam autem inventore repellendus ipsum est nemo facere corrupti quidem rem dignissimos dolore facilis ab debitis omnis. Magnam quisquam veritatis vitae quo, recusandae, dolorem ut facere incidunt quibusdam excepturi eum, vel sunt. Quis architecto quo optio necessitatibus at!'
    },
    {
      id: 'xyz',
      date: 1632151164,
      imageUrl: 'assets/images/news.jpg',
      title: 'Lorem ipsum dolor',
      shortDescription: 'Lorem ipsum dolor sit amet, adipisicing elit.',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. In quaerat, cum quos quibusdam autem inventore repellendus ipsum est nemo facere corrupti quidem rem dignissimos dolore facilis ab debitis omnis. Magnam quisquam veritatis vitae quo, recusandae, dolorem ut facere incidunt quibusdam excepturi eum, vel sunt. Quis architecto quo optio necessitatibus at!'
    },
  ]

  constructor(
    private navigationService: NavigationService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  getBackgroundUrl(imageUrl: string) {
    return {'background-image': `url('${imageUrl}')`};
  }

  back(): void {
    this.navigationService.back();
  }

  async openArticle(article: Article) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = '60vh';
    dialogConfig.data = article;

    const dialog = this.matDialog.open(ArticleComponent,dialogConfig);
    const value = await dialog.afterClosed().pipe(take(1)).toPromise();
  }

}

export interface Article {
  id: string;
  date: number;
  imageUrl: string;
  title: string;
  shortDescription: string;
  text: string;
}
