import { Component, EventEmitter, Output } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-header-banner',
  standalone: true,
  imports: [],
  templateUrl: './header-banner.component.html',
  styleUrl: './header-banner.component.css'
})
export class HeaderBannerComponent {


    constructor(private router: Router){}

    @Output()
    eventEmitter = new EventEmitter;


    backToMain(){

        this.router.navigateByUrl("/")
    }

    showBanner(){


        this.eventEmitter.emit(true)
    }

}
