import { Component, ElementRef, Input,OnDestroy,OnInit,Renderer2 } from '@angular/core';
import { BackgroundComponent } from '../background/background.component';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../model/model';
import { OrderService } from '../../service/order.service';
import { Subscription } from 'rxjs';
import { DateFormatterService } from '../../service/date-formatter.service';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [BackgroundComponent,CurrencyPipe],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit,OnDestroy{

    constructor(private render:Renderer2, private selector:ElementRef,
        private orderService:OrderService, private dateFormatter:DateFormatterService
    ){}

    
    @Input()
    product!:Product

    takenNum:number = 0
    totalNum:number = 0
    ordreDate!:Date;

    titleIsShowed:boolean = false;

    orderSubscription!:Subscription;
    dateSubscription!:Subscription;


    baseUrl:string = "http://4.233.150.100:8084"


    showTitle(){
        this.titleIsShowed = true;
    }

    hideTitle(){
        this.titleIsShowed = false;
    }

    increment(){

        let num = this.selector.nativeElement.querySelector('.takenCount')

        if(num.style.color === "red"){

            this.render.setStyle(num,'color','black')
        }

        if(this.takenNum == this.product.productQuantity-this.totalNum){

            this.render.setStyle(num,'color','red')

        }else if(this.takenNum < this.product.productQuantity-this.totalNum){

            this.takenNum++;
        }
    }

    decrement(){

        if(this.takenNum == this.product.productQuantity-this.totalNum){

            this.render.setStyle(this.selector.nativeElement.querySelector('.takenCount'),'color','black')
        }

        if(this.takenNum == 0){

            this.render.setStyle(this.selector.nativeElement.querySelector('.takenCount'),'color','red')

        }else if(this.takenNum <= this.product.productQuantity-this.totalNum){

            this.takenNum--;
        }
    }

    addArticle(){

        if(this.takenNum != 0){

            let newProduct:Product = {

                productId:this.product.productId,
                productName:this.product.productName,
                productPrice:this.product.productPrice,
                productQuantity:this.takenNum,
                productUrl:this.product.productUrl,
                productDescription:this.product.productDescription
            }
            
            this.orderService.orderRecoverModel(newProduct);
            this.takenNum = 0;


            if(this.ordreDate === undefined){

                this.orderService.dateRecouverModel(new Date())

            } 
        }

    }
       

    ngOnInit(): void {
        
        this.orderSubscription = this.orderService.orderRecover$.subscribe(res =>{

            if(res.has(this.product.productId)){

                this.totalNum = res.get(this.product.productId)?.productQuantity!;
            }
        })

        this.dateSubscription = this.orderService.dateRecove$.subscribe(res=>{

            this.ordreDate = res;
        })


    }

    ngOnDestroy(): void {
        
        this.orderSubscription.unsubscribe();
        this.dateSubscription.unsubscribe();
    }
}
