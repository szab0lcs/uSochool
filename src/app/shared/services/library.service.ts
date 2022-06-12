import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  library = this.afs.collection<Book>(`library`);

  constructor(private afs: AngularFirestore) { }
  addBook(book: Partial<Book>) {
    return new Promise(async (resolve, reject) => {
      if (!(book.title && book.author && book.isbn && book.maxRentPeriod)) {
        reject('undefined data');
      } else {
        const newBook: Book = {
          title: book.title,
          author: book.author,
          maxRentPeriod: book.maxRentPeriod,
          available: true,
          isbn: book.isbn
        }
        this.library.ref.add(newBook).then(() => {
          resolve('success')
        })
        .catch( error => {
          reject(error);
        })
      }
    })
  }

  async rentBook(book: Book, available: BookRental) {
    await this.editBook({...book, available});
    return this.afs.collection<Book>(`users/${available.rentedBy.userId}/books`).doc(book.id).set({...book,available});
  }
  
  async returnBook(book: Book): Promise<void> {
    console.log({book})
    if (book.available === true || !book.id) return;
    await this.editBook({...book, available: true});
    await this.afs.collection<Book>(`users/${book.available.rentedBy.userId}/books`).doc(book.id).delete();
  }
  async removeBook(bookId: string): Promise<void> {
    await this.library.ref.doc(bookId).delete();
  }

  editBook(book: Book) {
    return this.library.ref.doc(book.id).update(book);
  }
  
  getBooks$(): Observable<Book[]>{
    return this.library.valueChanges({idField: 'id'});
  }
}

export interface Book {
  id?: string;
  title: string;
  author: string;
  maxRentPeriod: number;
  available: true | BookRental;
  isbn: string;
}

export interface BookRental {
  rentedDate: Timestamp;
  rentPeriod: number;
  rentedBy: {
    userId: string;
    name: string;
  };
}
