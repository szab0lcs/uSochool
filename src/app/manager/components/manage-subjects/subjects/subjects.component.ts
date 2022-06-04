import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ISubject } from 'src/app/shared/interfaces/catalogue';
import { CatalogueService } from 'src/app/shared/services/catalogue.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {
  subjects$: Observable<ISubject[]> | undefined;
  addDisabled = false;
  constructor(
    public matDialogRef: MatDialogRef<SubjectsComponent>,
    private catalogueService: CatalogueService,
  ) { }

  ngOnInit(): void {
    this.subjects$ = this.catalogueService.getSubjects();
  }

  async addSubject(subjectElement: HTMLInputElement) {
    this.addDisabled = true;
    const subject = subjectElement.value;
    await this.catalogueService.addSubject({
      subjectId: subject.toLowerCase(),
      subjectName: subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase()
    })
    subjectElement.value = '';
    this.addDisabled = false;
  }

  async removeSubject(subjectId: string) {
    await this.catalogueService.removeSubject(subjectId);
  }
}
