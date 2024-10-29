import { Component, OnDestroy, OnInit } from '@angular/core';
import { BackgroundComponent } from '../background/background.component';
import { ArticleComponent } from '../article/article.component';
import { Subscription } from 'rxjs';
import { Product } from '../../model/model';
import { ProductListService } from '../../service/product-list.service';
import RequestService from '../../service/getRequest.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [BackgroundComponent,ArticleComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit,OnDestroy{

    constructor(private productList:ProductListService, private request:RequestService){}

    productSubscription!:Subscription
    products:Array<Product> = []

    isShow:boolean = false

    ngOnInit(): void {

        setTimeout(() => {

            this.isShow= true
            
        }, 1500);

        this.request.get_product("/back/product/all").subscribe(response=>{

            this.productList.recoverModel(response)

            this.productSubscription = this.productList.isRecover$.subscribe(res =>{

                this.products = res;
            })
        })
        

    }

    ngOnDestroy(): void {
        
        if(this.productSubscription !== null){

            this.productSubscription.unsubscribe();
        }
    }
}
