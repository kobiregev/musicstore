import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { RegisterComponent } from './components/register/register.component';
import { ShopComponent } from './components/shop/shop.component';
import { ShopGuardGuard } from './guards/shop-guard.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: MainPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'shop', component: ShopComponent, canActivate: [ShopGuardGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
