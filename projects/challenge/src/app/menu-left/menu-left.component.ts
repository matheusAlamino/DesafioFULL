import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { NavigationStart, Router } from '@angular/router'

@Component({
    selector: 'app-menu-left',
    templateUrl: './menu-left.component.html'
})
export class MenuLeftComponent implements OnInit {
    activeMenu: string

    constructor(
        private router: Router
    ) { }

    ngOnInit(): void {
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                this.activeMenu = event.url.split('/')[1]
            }
        })
    }
}
