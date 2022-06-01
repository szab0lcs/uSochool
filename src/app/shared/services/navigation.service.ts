import { Injectable } from '@angular/core'
import { Location } from '@angular/common'
import { Router, NavigationEnd } from '@angular/router'
import { ExistingRoutes } from 'src/app/app-routing.module'

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private history: string[] = []

  constructor(private router: Router, private location: Location) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects)
      }
    })
  }

  back(): void {
    this.history.pop()
    if (this.history.length > 0) {
      this.location.back()
    } else {
      this.router.navigateByUrl('/')
    }
  }

  navigateTo(url: ExistingRoutes) {
    this.router.navigateByUrl(url);
  }
  
  editUser(userId: string) {
    this.router.navigateByUrl(`${ExistingRoutes.EditUser}/${userId}`);
  }

  manageClass(classId: string) {
    this.router.navigateByUrl(`${ExistingRoutes.ManageClasses}/${classId}`)
  }

  public get eRoutes(): typeof ExistingRoutes {
    return ExistingRoutes;
  }
}