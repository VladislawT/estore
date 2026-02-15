import { Component, effect, signal, WritableSignal } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { CartItem } from '../types/cart.type';
import { Router } from '@angular/router';
import { CartStoreItem } from '../services/cart/cart.storeitem';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule, NgClass } from '@angular/common';
import { Ratings } from '../../ratings/ratings';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoggedInUser } from '../types/user.type';
import { UserService } from '../user/services/user';
import { Order } from '../services/order/order';

@Component({
  selector: 'app-cart',
  imports: [FontAwesomeModule, CommonModule, Ratings, ReactiveFormsModule, NgClass],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  faTrash = faTrash;
  faBoxOpen = faBoxOpen;
  faShoppingCart = faShoppingCart;

  alertType: number = 0;
  alertMessage: string = '';
  disableChekout: boolean = false;

  user = signal<LoggedInUser>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pin: '',
    email: '',
  });

  orderForm: WritableSignal<FormGroup>;

  constructor(
    public cartStore: CartStoreItem,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private orderService: Order,
  ) {
    this.orderForm = signal(this.createOrderForm(this.user()));
    this.userService.loggedInUser$.subscribe((u) => this.user.set(u));

    effect(() => {
      const newUser = this.user();
      this.orderForm.set(this.createOrderForm(newUser));
    });
  }

  private createOrderForm(user: LoggedInUser | null): FormGroup {
    return this.fb.group({
      name: [
        user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}`.trim() : '',
        Validators.required,
      ],
      address: [user?.address || '', Validators.required],
      city: [user?.city || '', Validators.required],
      state: [user?.state || '', Validators.required],
      pin: [user?.pin || '', Validators.required],
    });
  }

  navigateToHome(): void {
    this.router.navigate(['home/products']);
  }

  updateQuantity($event: any, cartItem: CartItem): void {
    if ($event.target.innerText === '+') {
      this.cartStore.addProduct(cartItem.product);
      console.log(this.cartStore.cart());
    } else if ($event.target.innerText === '-') {
      this.cartStore.decreaseProductQuantity(cartItem);
    }
  }

  removeItem(cartItem: CartItem): void {
    this.cartStore.removeProduct(cartItem);
  }

  onSubmit(): void {
    if (!this.userService.isUserAuthenticated) {
      this.alertType = 2;
      this.alertMessage = 'Please log in to register your order';
      return;
    }
    const form = this.orderForm();

    if (form.invalid) {
      this.alertType = 2;
      this.alertMessage = 'Please fill out all required fields correctly';
      return;
    }

    const deliveryAddress = {
      userName: form.get('name')?.value,
      address: form.get('address')?.value,
      city: form.get('city')?.value,
      state: form.get('state')?.value,
      pin: form.get('pin')?.value,
    };

    const email = this.user()?.email;

    if (!email) {
      this.alertType = 2;
      this.alertMessage = 'User email not found. Please log in again';
      return;
    }

    this.orderService.saveOrder(deliveryAddress, email).subscribe({
      next: (res) => {
        this.cartStore.clearCart();
        this.alertType = 0;
        this.alertMessage = 'Order reginster successfully!';
        this.disableChekout = true;
      },
      error: (error) => {
        this.alertType = 2;
        if (error.error?.message === 'Authorization failed') {
          this.alertMessage = 'Please log in to register your order';
        } else {
          this.alertMessage = error.error?.message || 'Anunexpected error occurred';
        }
      },
    });
  }
}
