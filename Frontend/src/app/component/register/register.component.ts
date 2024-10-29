import { CommonModule} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import RequestService from '../../service/getRequest.service';
import { BackgroundComponent } from '../background/background.component';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule,RouterLink, CommonModule, RouterLinkActive,BackgroundComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

    doReturn:boolean=false
    doWarning:boolean= false
    warningMsg:string = ''

    isShow:boolean = false

    constructor(private formBuilder:FormBuilder, private request:RequestService, private router:Router){}

    registerForm = this.formBuilder.group({
        userName : ['',[Validators.required,Validators.minLength(3)]],
        pwd : ['',[Validators.required,Validators.minLength(4)]],
        pwdConfirm: [''],
    })

    move(){

        this.doReturn = true
    }

    init(){
        this.doReturn = false
    }

    sendRegistration(event:Event){

        event.preventDefault();

        if(this.registerForm.status=='INVALID' ||  this.registerForm.value.pwd != this.registerForm.value.pwdConfirm){
            
            this.warningMsg = 'Please verify your input information...'
            this.doWarning = true;

        }else{

            const formValues = this.registerForm.value


            const body = {"userName":this.registerForm.value.userName,
                          "password":this.registerForm.value.pwd}

            
            this.request.post_register("/back/usr/register",body)

                        .subscribe(
                            res=> {

                                formValues.pwd = ''
                                formValues.pwdConfirm = ''
                                formValues.userName = ''

                                if(res.status == 200){

                                    this.router.navigateByUrl("/login")
                                }else{
                                    
                                    this.warningMsg = 'Please try later...'
                                    this.doWarning = true;
                                }
                            }
                        )
        }


    }

    removeWarning(){this.doWarning = false}

    ngOnInit(): void {
        
        setTimeout(() => {
            
            this.isShow = true
        }, 2000);
    }
}
