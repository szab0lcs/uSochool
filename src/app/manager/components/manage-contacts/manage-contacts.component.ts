import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Contacts, EditContactsService } from 'src/app/shared/services/edit-contacts.service';
import { EditFieldService } from 'src/app/shared/services/edit-field.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-manage-contacts',
  templateUrl: './manage-contacts.component.html',
  styleUrls: ['./manage-contacts.component.scss']
})
export class ManageContactsComponent implements OnInit {
  contacts$: Observable<Contacts | undefined>;
  constructor(
    private navigationService: NavigationService,
    private contactsService: EditContactsService,
    private editFieldService: EditFieldService,
  ) {
    this.contacts$ = this.contactsService.getContacts$();
   }

  ngOnInit(): void {
  }

  back(): void {
    this.navigationService.back();
  }

  async setContacts(title: string, value: string, field: 'email' | 'open' | 'phone', contacts: Contacts) {
    const contact = contacts;
    const editedValue = await this.editFieldService.edit<string>({title, type: 'text', value});
    if (editedValue) contact[field] = editedValue;
    this.contactsService.setContacts(contact);
  }
}
