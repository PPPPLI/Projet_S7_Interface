import { Component, OnDestroy, OnInit } from '@angular/core';
import { BackgroundComponent } from '../background/background.component';
import { OrderService } from '../../service/order.service';
import { Subscription } from 'rxjs';
import { Order } from '../../model/model';
import { DateFormatterService } from '../../service/date-formatter.service';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import RequestService from '../../service/getRequest.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [BackgroundComponent,CurrencyPipe,SlicePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit,OnDestroy{

    constructor(private orderService:OrderService, private dateFormatter:DateFormatterService,
        private getRequest:RequestService, private userService:UserService
    ){}

    baseUrl:string = "http://4.233.150.100:8084"


    orderSubscription:Subscription = new Subscription()
    dateSubscription:Subscription = new Subscription()
    userSubscription:Subscription = new Subscription()
    totalPrice = 0;
    userName = "";
    orderList:Order[] = []
    paidTotalPriceList:number[] = []

    order:Order = {

        orderProducts:[],
        orderDate : "",
        isPaid:false,
        orderId:"",
        orderOwnerName:""
    };


    toggleDropdown(index:number,event:MouseEvent) {

        event.stopPropagation()

        const dropdown = document.getElementById("paidProduct"+index);
        if (dropdown!.classList.contains('expanded')) {
            dropdown!.classList.remove('expanded');
            dropdown!.style.maxHeight = '0';
        } else {
            dropdown!.classList.add('expanded');
            dropdown!.style.maxHeight = (dropdown!.scrollHeight) + 20 + 'px'; 
        }
    }

    payOrder(){

        if(this.order.orderProducts.length != 0){


            this.getRequest.post_create_order("/back/order/payment",this.order.orderProducts,this.userName).subscribe(res =>{

                if(res.ok){

                    this.order.isPaid = true
                }else{

                    console.log(res.body)
                }
            })
        }
        
    }

    ngOnInit(): void {
        
        this.orderSubscription = this.orderService.orderRecover$.subscribe(res=>{

            
            res.forEach((val)=>{

                this.totalPrice += val.productPrice * val.productQuantity
                this.order.orderProducts.push({

                    product:val,
                    quantity:val.productQuantity,
                    order:null!
                })
            })

        })

        this.dateSubscription = this.orderService.dateRecove$.subscribe(res =>{

            if(res != null){

                this.order.orderDate = this.dateFormatter.dateFormatter(res)
            }
            
        })

        this.userSubscription = this.userService.userRecover$.subscribe(res=>{

            this.userName = res.userName
        })

        this.userName = localStorage.getItem("userName")!

        this.getRequest.get_order(`/back/order/${this.userName}`).subscribe(res =>{

            this.orderList = res

            res.forEach(ele =>{

                let price = 0

                ele.orderProducts.forEach(element => {
                    
                    price += element.product.productPrice * element.quantity
                });

                this.paidTotalPriceList.push(price)
            })

        })
        
    }

    ngOnDestroy(): void {
        this.dateSubscription.unsubscribe();
        this.orderSubscription.unsubscribe();

        if(this.order.isPaid){

            this.orderService.orderRecoverModel(new Map())
            this.orderService.dateRecouverModel(null!)
        }
    }


}
