import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { ShopComponent } from './component/shop/shop.component';
import { CartComponent } from './component/cart/cart.component';
import { routerGuard} from './guard/router.guard';

export const routes: Routes = [

    {path:"login",component:LoginComponent},
    {path:"register",component:RegisterComponent},
    {path:"home", component:ShopComponent},
    {path:"", redirectTo:"/home",pathMatch:"full"},
    {path:"cart",component:CartComponent,canActivate:[routerGuard]}
];
