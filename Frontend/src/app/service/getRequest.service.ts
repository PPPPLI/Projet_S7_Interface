import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { Order, OrderProduct, Product } from "../model/model";


@Injectable({
    providedIn:"root"
})

export default class RequestService{

    constructor(private httpClient:HttpClient){}

    get_login(url:string, data:object,headers:HttpHeaders){

        return this.httpClient.post(url,data,{observe:'response',headers,responseType:"text"})
            .pipe(
                tap({                      
                    error(err){
                        alert("Information incorrecte")
                    }
                })
        )
    }

    post_register(url:string,data:object){

        return this.httpClient.post(url,data,{observe:"response",responseType:"text"})
        .pipe(
            tap({
                error(err){

                    console.log(err)
                }
            })
        )
    }

    get_product(url:string):Observable<Product[]>{

        return this.httpClient.get<Product[]>(url)
        .pipe(
            tap({

                error(err){

                    console.log(err)
                }
            })
        )
    }


    post_create_order(url:string,products:OrderProduct[], userName:string){

        let data = {

            orderOwnerName:userName,
            isPaid:false,
            orderProducts:products
        }

        let order = JSON.stringify(data)


        return this.httpClient.post(url,order,{observe:"response",headers:{

            'Content-Type': 'application/json'
        },responseType:"text"}).pipe(
            
            tap({
                error(err){

                    console.log(err)
                }
            })
        )
    }

    get_order(url:string):Observable<Order[]>{


        return this.httpClient.get<Order[]>(url).pipe(

            tap({

                error(err){

                    console.log(err)
                }
            })
        )
    }

}