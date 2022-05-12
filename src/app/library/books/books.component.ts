import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Book } from '../library.component';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  private timeout?: number;
  searchFilter: any = '';
  query = '';
  books: Book[] = [
    {
      id: 'asd123',
      title: 'Lorem ipsum dolor sit abc',
      author: 'Example Author',
      maxRentPeriod: 30,
      available: true,
      isbn: '9496518465146854324564',
    },
    {
      id: 'asd6347823123',
      title: 'Lorem ipsum zzz',
      author: 'Example Author',
      maxRentPeriod: 30,
      available: true,
      isbn: '9496518465146854324564',
    },
    {
      id: 'asddfefw123',
      title: 'Lorem ipsum dolor',
      author: 'Example Szerzo',
      maxRentPeriod: 60,
      available: true,
      isbn: '9496518465146854324564',
    },
    {
      id: 'asdr32d123',
      title: 'Lorem ipsum sit',
      author: 'Example Author',
      maxRentPeriod: 30,
      available: false,
      isbn: '9496518465146854324564',
    },
    {
      id: 'asdf32f3d123',
      title: 'Lorem ipsum dolor sit amet',
      author: 'Pelda Author',
      maxRentPeriod: 60,
      available: true,
      isbn: '9496518465146854324564',
    },
    {
      id: 'af34f4fsd123',
      title: 'Lorem dolor sit',
      author: 'Example Author',
      maxRentPeriod: 30,
      available: false,
      isbn: '9496518465146854324564',
    },

  ]

  constructor(
    public matDialogRef: MatDialogRef<BooksComponent>,
  ) { }

  ngOnInit(): void {
  }

  onSearchChange(el: any): void {  
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => this.search(el), 250);
  }
  
  search(el: any){
    const target = el? el.target : undefined;
    const value = target && target.value ? target.value : '';
    this.query = value;
  }
}