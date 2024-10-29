import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../service/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-banner.component.html',
  styleUrl: './header-banner.component.css'
})
export class HeaderBannerComponent implements OnInit,OnDestroy{


    constructor(private router: Router, private orderService:OrderService){}

    @Output()
    eventEmitter = new EventEmitter;

    artcleNum:number = 0;
    orderSubscription:Subscription = new Subscription()


    backToMain(){

        this.router.navigateByUrl("/")
    }

    showBanner(){


        this.eventEmitter.emit(true)
    }

    ngOnInit(): void {
        
        this.orderSubscription = this.orderService.orderRecover$.subscribe(res =>{

            this.artcleNum = 0;

            res.forEach((value)=>{

                this.artcleNum += value.productQuantity;
            })
        })
    }

    ngOnDestroy(): void {
        
        this.orderSubscription.unsubscribe()
    }
}
