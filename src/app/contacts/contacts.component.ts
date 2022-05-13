import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../shared/services/navigation.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  constructor(
    private navigationService: NavigationService,
  ) { }

  ngOnInit(): void {
  }

  back(): void {
    this.navigationService.back();
  }
}
