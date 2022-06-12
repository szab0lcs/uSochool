import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Contacts, EditContactsService } from '../shared/services/edit-contacts.service';
import { NavigationService } from '../shared/services/navigation.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contacts$: Observable<Contacts | undefined>;
  constructor(
    private navigationService: NavigationService,
    private contactsService: EditContactsService
  ) {
    this.contacts$ = this.contactsService.getContacts$();
   }

  ngOnInit(): void {
  }

  back(): void {
    this.navigationService.back();
  }
}
