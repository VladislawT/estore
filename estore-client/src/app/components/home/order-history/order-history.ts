import { Component, signal, OnInit } from '@angular/core';
import { Order, OrderSummary, OrderProduct } from '../services/order/order';
import { UserService } from '../user/services/user';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoxOpen, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory implements OnInit {
  faBoxOpen = faBoxOpen;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;

  orders = signal<OrderSummary[]>([]);
  expandedOrderId = signal<number | null>(null);
  orderProducts = signal<Record<number, OrderProduct[]>>({});
  loading = signal(true);
  errorMessage = signal('');

  constructor(
    private orderService: Order,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.userService.isUserAuthenticated) {
      this.router.navigate(['home/login']);
      return;
    }

    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Не удалось загрузить заказы');
        if (err.status === 401) {
          this.userService.logout();
          this.router.navigate(['home/login']);
        }
      },
    });
  }

  toggleOrderDetails(orderId: number): void {
    const current = this.expandedOrderId();
    if (current === orderId) {
      this.expandedOrderId.set(null);
      return;
    }

    this.expandedOrderId.set(orderId);

    if (!this.orderProducts()[orderId]) {
      this.orderService.getOrderProducts(orderId).subscribe({
        next: (products) => {
          this.orderProducts.update((prev) => ({ ...prev, [orderId]: products }));
        },
        error: () => {
          this.orderProducts.update((prev) => ({ ...prev, [orderId]: [] }));
        },
      });
    }
  }

  isExpanded(orderId: number): boolean {
    return this.expandedOrderId() === orderId;
  }

  getProducts(orderId: number): OrderProduct[] {
    return this.orderProducts()[orderId] || [];
  }

  navigateToProducts(): void {
    this.router.navigate(['home/products']);
  }
}
