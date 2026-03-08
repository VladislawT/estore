import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home').then((c) => c.Home),
    children: [
      {
        path: 'products',
        loadComponent: () =>
          import('./components/home/products-gallery/products-gallery').then(
            (c) => c.ProductsGallery,
          ),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('./components/home/product-details/product-details').then(
            (c) => c.ProductDetails,
          ),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./components/home/cart/cart').then((c) => c.Cart),
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./components/home/wishlist/wishlist').then(
            (c) => c.Wishlist,
          ),
      },
      {
        path: 'orders',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./components/home/order-history/order-history').then(
            (c) => c.OrderHistory,
          ),
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./components/home/user/user-signup/user-signup').then(
            (c) => c.UserSignup,
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/home/user/user-login/user-login').then(
            (c) => c.UserLogin,
          ),
      },
    ],
  },
  { path: '', redirectTo: '/home/products', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found').then((c) => c.NotFound),
  },
];
