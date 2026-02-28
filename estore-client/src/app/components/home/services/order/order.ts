import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartStoreItem } from '../cart/cart.storeitem';
import { UserService } from '../../user/services/user';
import { DeliveryAddress } from '../../types/cart.type';
import { Observable } from 'rxjs';
import { OrderItem, OrderProduct, OrderSummary } from '../../types/order.type';
import { OrderTypes } from '../../types/order.type';

@Injectable()
export class Order {
  private readonly baseUrl = 'http://localhost:5001/orders';

  constructor(
    private httpClient: HttpClient,
    private cartStore: CartStoreItem,
    private userService: UserService,
  ) {}

  getOrders(): Observable<OrderSummary[]> {
    return this.httpClient.get<OrderSummary[]>(`${this.baseUrl}/allorders`, {
      headers: { authorization: this.userService.token },
    });
  }

  getOrderProducts(orderId: number): Observable<OrderProduct[]> {
    return this.httpClient.get<OrderProduct[]>(`${this.baseUrl}/orderproducts`, {
      params: { orderId },
      headers: { authorization: this.userService.token },
    });
  }

  saveOrder(deliveryAddress: DeliveryAddress, userEmail: string): Observable<any> {
    const url: string = `${this.baseUrl}/add`;
    const orderDetails: OrderItem[] = [];

    this.cartStore.cart().products.forEach((product) => {
      const orderItem: OrderItem = {
        productId: product.product.id,
        prise: product.product.price,
        qty: product.quantity,
        amount: product.amount,
      };
      orderDetails.push(orderItem);
    });

    const order: OrderTypes = {
      userName: deliveryAddress.userName,
      address: deliveryAddress.address,
      city: deliveryAddress.city,
      state: deliveryAddress.state,
      pin: deliveryAddress.pin,
      total: this.cartStore.cart().totalAmount,
      userEmail: userEmail,
      orderDetails: orderDetails,
    };

    return this.httpClient.post(url, order, {
      headers: { authorization: this.userService.token },
    });
  }
}
