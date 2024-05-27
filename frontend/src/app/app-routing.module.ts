import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductFormComponent } from './product/product-form/product-form.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'products/new', component: ProductFormComponent, canActivate: [AdminGuard] },
  { path: 'products/:id/edit', component: ProductFormComponent, canActivate: [AdminGuard] },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
