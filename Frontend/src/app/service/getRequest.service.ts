import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";


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
                        console.log(err);
                    }
                })
        )
    }

}