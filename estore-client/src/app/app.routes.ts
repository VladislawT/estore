import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { NotFound } from './components/not-found/not-found';
import { ProductsGallery } from './components/home/products-gallery/products-gallery';
import { ProductDetails } from './components/home/product-details/product-details';
import { Cart } from './components/home/cart/cart';
import { UserSignup } from './components/home/user/user-signup/user-signup';
import { UserLogin } from './components/home/user/user-login/user-login';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./components/home/home').then((c) => c.Home),
    children: [
      {
        path: 'products',
        component: ProductsGallery,
      },
      {
        path: 'product/:id',
        component: ProductDetails,
      },
      {
        path: 'cart',
        component: Cart,
      },
      {
        path: 'signup',
        component: UserSignup,
      },
      {
        path: 'login',
        component: UserLogin
      }
    ],
  },
  { path: '', redirectTo: '/home/products', pathMatch: 'full' },
  { path: '**', component: NotFound },
];
