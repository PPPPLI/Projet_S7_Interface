import { Injectable } from '@angular/core';
import { Order, Product } from '../model/model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() { }

  productMap:Map<string,Product> = new Map()

  orderCreateDate?:Date;

  orderRecover$ = new BehaviorSubject<Map<string,Product>>(this.productMap)
  dateRecove$ = new BehaviorSubject<Date>(this.orderCreateDate!)

  orderRecoverModel(product:any){

    if(product instanceof Map){

        this.productMap.clear()

    }else{


        if(!this.productMap.has(product.productId)){

            this.productMap.set(product.productId,product)
        }else{
    
            product.productQuantity += this.productMap.get(product.productId)!.productQuantity;
    
            this.productMap.set(product.productId,product)
        }
    }

    this.orderRecover$.next(this.productMap)
  }

  dateRecouverModel(date:Date){

    this.dateRecove$.next(date)
  }

}
