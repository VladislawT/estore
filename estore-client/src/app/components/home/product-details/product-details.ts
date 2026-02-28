import { Component, inject, signal } from '@angular/core';
import { Ratings } from '../../ratings/ratings';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../services/product/products.service';
import { Product } from '../types/products.type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { CartStoreItem } from '../services/cart/cart.storeitem';
import { WishlistStoreItem } from '../services/wishlist/wishlist.storeitem';
import { faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-product-details',
  imports: [Ratings, CommonModule, FontAwesomeModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductsService);
  private readonly cart = inject(CartStoreItem);
  readonly wishlist = inject(WishlistStoreItem);

  readonly product = signal<Product | null>(null);

  faShoppingCart = faShoppingCart;
  faHeart = faHeart;
  faHeartRegular = faHeartRegular;

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (id !== null && !isNaN(id)) {
      this.productService
        .getProduct(id)
        .pipe(takeUntilDestroyed())
        .subscribe((res) => {
          this.product.set(Array.isArray(res) ? res[0] : res);
        });
      return;
    }
  }

  addToCart() {
    const product = this.product();
    if (product) {
      this.cart.addProduct(product);
    }
  }

  toggleWishlist() {
    const product = this.product();
    if (product) {
      this.wishlist.toggleProduct(product);
    }
  }
}
