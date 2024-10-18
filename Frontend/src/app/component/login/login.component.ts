import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { HttpHeaders } from '@angular/common/http';
import { BackgroundComponent } from '../background/background.component';
import RequestService from '../../service/getRequest.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule,RouterLink, CommonModule, RouterLinkActive,NgOptimizedImage,BackgroundComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

    doReturn:boolean=false
    doWarning:boolean= false
    warningMsg:string=''
    showComponent:boolean = false;

    @Output()
    emiter = new EventEmitter()

    constructor(private formBuilder:FormBuilder,
                private router:Router,private clientRequest:RequestService){}

    registerForm = this.formBuilder.group({
        userName : ['',[Validators.required,Validators.minLength(3)]],
        pwd : ['',[Validators.required,Validators.minLength(4)]],
    })


    move(){

        this.doReturn = true
    }

    init(){
        this.doReturn = false
    }

    sendRegistration(event:Event){

        event.preventDefault();

        if(this.registerForm.status=='INVALID'){
            
            this.doWarning = true;
            this.warningMsg = "Please verify your input information..."

        }else{

            const formValues = this.registerForm.value
            const body = {
                
                "userName": formValues.userName,
                "password": formValues.pwd        
            }

            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(`${formValues.userName}:${formValues.pwd}`)}`
              });
              
            this.clientRequest.get_login("/back/usr/login",body,headers).subscribe(response =>{

                console.log(response.body)

                localStorage.setItem("token",JSON.stringify(response.body))
                formValues.pwd = "";
                formValues.userName="";
                this.doWarning = false;

                this.router.navigateByUrl("/")
            })

        }


    }

    removeWarning(){this.doWarning = false}

    ngOnInit(): void {
        
        setTimeout(() => {

            this.showComponent = true;

        }, 2000);

        
    }
}

