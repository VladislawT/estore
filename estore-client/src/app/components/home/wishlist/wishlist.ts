import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistStoreItem } from '../services/wishlist/wishlist.storeitem';
import { CartStoreItem } from '../services/cart/cart.storeitem';
import { Product } from '../types/products.type';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { Ratings } from '../../ratings/ratings';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [FontAwesomeModule, CommonModule, Ratings, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist {
  faHeart = faHeart;
  faShoppingCart = faShoppingCart;
  faTrash = faTrash;

  constructor(
    public wishlistStore: WishlistStoreItem,
    private cartStore: CartStoreItem,
    private router: Router,
  ) {}

  removeFromWishlist(product: Product): void {
    this.wishlistStore.removeProduct(product);
  }

  addToCart(product: Product): void {
    this.cartStore.addProduct(product);
    this.router.navigate(['home/cart']);
  }

  navigateToProducts(): void {
    this.router.navigate(['home/products']);
  }
}
