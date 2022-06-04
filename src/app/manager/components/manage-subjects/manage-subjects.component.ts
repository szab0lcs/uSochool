import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ProfilesComponent } from './profiles/profiles.component';
import { SubjectsComponent } from './subjects/subjects.component';

@Component({
  selector: 'app-manage-subjects',
  templateUrl: './manage-subjects.component.html',
  styleUrls: ['./manage-subjects.component.scss']
})
export class ManageSubjectsComponent implements OnInit {

  constructor(
    public navS: NavigationService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  openProfiles(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = '60vh';
    dialogConfig.autoFocus = false;
    
    this.matDialog.open(ProfilesComponent,dialogConfig);
  }
  
  openSubjects(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'forgot-password';
    dialogConfig.backdropClass = 'forgot-password-backdrop';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = '60vh';
    dialogConfig.autoFocus = false;

    this.matDialog.open(SubjectsComponent,dialogConfig);
  }

}
