import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { BackgroundComponent } from './component/background/background.component';

export const routes: Routes = [

    {path:"login",component:LoginComponent},
    {path:"register",component:RegisterComponent},
    {path:"home", component:BackgroundComponent},
    {path:"", redirectTo:"/home",pathMatch:"full"}
];
