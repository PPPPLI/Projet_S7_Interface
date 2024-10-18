import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { HeaderBannerComponent } from '../header-banner/header-banner.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [HeaderBannerComponent,RouterOutlet,RouterLinkActive, RouterLink],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit{



    showContent:boolean = false
    isShowBanner:boolean = false

    ngOnInit(): void {
        
        setTimeout(() => {

            this.showContent = true
            
        }, 2000);
    }

    showBanner(data:boolean){

        this.isShowBanner = data 

           
    }

    bannerControl(){



        this.isShowBanner = !this.showBanner;

    }

}
