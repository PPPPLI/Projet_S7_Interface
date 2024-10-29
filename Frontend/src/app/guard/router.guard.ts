import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TimeValidationService } from '../service/time-validation.service';

@Injectable({
    providedIn:'root'
})
class permissionService{

    constructor(private router:Router,private timeValidation:TimeValidationService){}

    canActived(){

        let token = localStorage.getItem('token')
        let tokenCreatedTime = localStorage.getItem('receiveDate')
        let isValidated = false

        if(tokenCreatedTime != null){

            let tokenTime = new Date(JSON.parse(tokenCreatedTime))

            isValidated = this.timeValidation.checkTime(tokenTime,new Date()) 
        }


        if(token != null && isValidated){
            return true
        }

        this.router.navigateByUrl('/login')
        return false
    }
    
}

export const routerGuard: CanActivateFn = (route, state) => {
    
    return inject(permissionService).canActived()
};
