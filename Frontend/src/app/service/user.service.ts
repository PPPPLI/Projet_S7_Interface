import { Injectable } from '@angular/core';
import { User } from '../model/model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  user:User = {

    userName:"",
    isLogged:false
  }

  userRecover$ = new BehaviorSubject<User>(this.user)

  userRecoverModel(userInfo:User){

    this.user = userInfo

    this.userRecover$.next(this.user)
  }
}
