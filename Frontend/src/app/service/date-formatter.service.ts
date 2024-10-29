import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {

  dateFormatter(date:Date){

    return date.toLocaleDateString("fr-FR",{

        year:"2-digit",
        month:"2-digit",
        day:"2-digit",
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit"
    }).replace("/\//g","-")
  }
}
