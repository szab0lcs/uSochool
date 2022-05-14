import { Component, OnInit } from '@angular/core';
import { ExistingRoutes } from 'src/app/app-routing.module';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  constructor(
    public navS: NavigationService,
  ) { }

  ngOnInit(): void {
  }

}
