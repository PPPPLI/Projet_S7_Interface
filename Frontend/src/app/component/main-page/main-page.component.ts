import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { HeaderBannerComponent } from '../header-banner/header-banner.component';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [HeaderBannerComponent,RouterOutlet,RouterLinkActive, RouterLink],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit{

    constructor(private userService:UserService, private router:Router){}

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

    logOut(){

        let res = confirm("Want to Log out ?")

        if(res){

            localStorage.clear()
            this.userService.userRecoverModel(
    
                {
                    userName: "",
                    isLogged: false
                }
            )
    
            this.bannerControl()
            this.router.navigateByUrl("/")
        }

    }

}
