import { Injectable } from '@angular/core';
import { Product } from '../model/model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductListService {

  constructor() { }

  productList:Array<Product> = []

  isRecover$ = new BehaviorSubject<Array<Product>>(this.productList)

  recoverModel(products:Array<Product>){

    this.productList = products;
    this.isRecover$.next(this.productList)
  }
}
