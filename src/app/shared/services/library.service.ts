import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor() { }

  addBook() {

  }

  removeBook() {

  }

  getBooks$(){

  }
}

export interface Book {
  id: string;
  title: string;
  author: string;
  maxRentPeriod: number;
  available: true | BookRental;
  isbn: string;
}

export interface BookRental {
  rentedDate: number;
  rentPeriod: number;
  rentedBy: string;
}
