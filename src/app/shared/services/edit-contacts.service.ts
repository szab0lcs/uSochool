import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class EditContactsService {

  contacts = this.afs.collection<Contacts>(`contacts`).doc('data');

  constructor(private afs: AngularFirestore) { }

  getContacts$(){
    return this.contacts.valueChanges();
  }

  setContacts(contactsData: Contacts) {
    return this.contacts.set(contactsData);
  }
}

export interface Contacts {
  email: string;
  open: string;
  phone: string;
}
