import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { IClassProfile } from 'src/app/shared/interfaces/catalogue';
import { CatalogueService } from 'src/app/shared/services/catalogue.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {
  profiles$: Observable<IClassProfile[]> | undefined;
  addDisabled = false;
  constructor(
    public matDialogRef: MatDialogRef<ProfilesComponent>,
    private catalogueService: CatalogueService,
  ) { }

  ngOnInit(): void {
    this.profiles$ = this.catalogueService.getProfiles();
  }

  async addProfile(profileElementId: HTMLInputElement,profileElementName: HTMLInputElement) {
    this.addDisabled = true;
    const profile = profileElementName.value;
    const profileId = profileElementId.value;
    await this.catalogueService.addProfile({
      id: profileId,
      name: profile.charAt(0).toUpperCase() + profile.slice(1).toLowerCase()
    })
    profileElementName.value = '';
    profileElementId.value = '';
    this.addDisabled = false;
  }

  async removeProfile(profileId: string) {
    await this.catalogueService.removeProfile(profileId);
  }
}
