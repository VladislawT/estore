import { afterNextRender, ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductsService } from '../home/services/product/products.service';
import { Product } from './products.type';
import { CommonModule } from '@angular/common';
import { Ratings } from '../ratings/ratings';
import { ProductsStoreItem } from '../home/services/product/products.storeitem';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoxOpen, faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { RouterLink } from '@angular/router';
import { CartStoreItem } from '../home/services/cart/cart.storeitem';
import { WishlistStoreItem } from '../home/services/wishlist/wishlist.storeitem';

@Component({
  selector: 'app-products',
  imports: [CommonModule, Ratings, FontAwesomeModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  faBoxOpen = faBoxOpen;
  faShoppingCart = faShoppingCart;
  faHeart = faHeart;
  faHeartRegular = faHeartRegular;

  constructor(
    public productsStoreItem: ProductsStoreItem,
    private cart: CartStoreItem,
    public wishlist: WishlistStoreItem,
  ) {}

  addToCart(product: Product) {
    this.cart.addProduct(product);
  }

  toggleWishlist(product: Product, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.wishlist.toggleProduct(product);
  }
}
