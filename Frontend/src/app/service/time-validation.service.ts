import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeValidationService {

  constructor() { }

  checkTime(time:Date,currentTime:Date){


    time.setHours(time.getHours() + 1)


    return time >= currentTime
  }
}
