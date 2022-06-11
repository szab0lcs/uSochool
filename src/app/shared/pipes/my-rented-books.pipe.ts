import { Pipe, PipeTransform } from '@angular/core';
import { Book } from '../services/library.service';

@Pipe({ name: 'myRentedBooks' })
export class MyRentedBooksPipe implements PipeTransform {
    transform(books: Book[], myUserId: string) {
        const filteredBooks = books.filter( book => this.isMyRent(book,myUserId))
        return filteredBooks
    }

    isMyRent(book: Book, userId: string) {
        if (book.available !== true) return book.available.rentedBy === userId;
        return;
    }
  }