import { computed, effect, signal } from '@angular/core';
import { Product } from '../../types/products.type';

const WISHLIST_KEY = 'wishlist';

export class WishlistStoreItem {
  private readonly _products = signal<Product[]>(this.getInitialData());

  private _saveEffect = effect(() => {
    const products = this._products();
    if (typeof localStorage !== 'undefined') {
      if (products.length === 0) {
        localStorage.removeItem(WISHLIST_KEY);
      } else {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(products));
      }
    }
  });

  readonly totalItems = computed(() => this._products().length);

  readonly wishlist = computed(() => this._products());

  addProduct(product: Product): void {
    const current = this._products();
    if (current.some((p) => p.id === product.id)) {
      return;
    }
    this._products.set([...current, product]);
  }

  removeProduct(product: Product): void {
    this._products.set(this._products().filter((p) => p.id !== product.id));
  }

  isInWishlist(productId: number): boolean {
    return this._products().some((p) => p.id === productId);
  }

  toggleProduct(product: Product): void {
    if (this.isInWishlist(product.id)) {
      this.removeProduct(product);
    } else {
      this.addProduct(product);
    }
  }

  private getInitialData(): Product[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const data = localStorage.getItem(WISHLIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
