import { computed, effect, signal } from '@angular/core';
import { CartItem } from '../../types/cart.type';
import { Product } from '../../types/products.type';

export class CartStoreItem {
  private readonly _products = signal<CartItem[]>(this.getInitialData());

  //кеш
  private _saveEffect = effect(() => {
    const products = this._products();
    if (typeof sessionStorage !== 'undefined') {
      if (products.length === 0) {
        sessionStorage.removeItem('cart');
      } else {
        sessionStorage.setItem('cart', JSON.stringify(products));
      }
    }
  });

  readonly totalAmount = computed(() =>
    this._products().reduce((sum, item) => (sum += item.amount), 0),
  );

  readonly totalProducts = computed(() =>
    this._products().reduce((count, item) => count + item.quantity, 0),
  );

  readonly cart = computed(() => ({
    products: this._products(),
    totalAmount: this.totalAmount(),
    totalProducts: this.totalProducts(),
  }));

  addProduct(product: Product): void {
    const curentItems = this._products();
    const existingIndex = curentItems.findIndex((item) => item.product.id === product.id);

    if (existingIndex === -1) {
      this._products.set([
        ...curentItems,
        {
          product,
          quantity: 1,
          amount: Number(product.price),
        },
      ]);
    } else {
      const updatedItems = [...curentItems];
      const existing = updatedItems[existingIndex];

      updatedItems[existingIndex] = {
        ...existing,
        quantity: existing.quantity + 1,
        amount: existing.amount + Number(product.price),
      };
      this._products.set(updatedItems);
    }
  }

  decreaseProductQuantity(cartItem: CartItem): void {
    const updatedItems = this._products()
      .map((item) => {
        if (item.product.id === cartItem.product.id) {
          if (item.quantity <= 1) {
            return null;
          }
          return {
            ...item,
            quantity: item.quantity - 1,
            amount: item.amount - Number(item.product.price),
          };
        }
        return item;
      })
      .filter(Boolean) as CartItem[]; //удаляем null

    this._products.set(updatedItems);
  }

  removeProduct(cartItem: CartItem): void {
    const updatedItems = this._products().filter((item) => {
      return item.product.id !== cartItem.product.id;
    });
    this._products.set(updatedItems);
  }

  private getInitialData(): CartItem[] {
    try {
      if (typeof sessionStorage === 'undefined') return [];
      const data = sessionStorage.getItem('cart');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
  clearCart(): void {
    sessionStorage.clear();
    this.cart().products = [];
    this.cart().totalAmount = 0;
    this.cart().totalProducts = 0;
  }
}
