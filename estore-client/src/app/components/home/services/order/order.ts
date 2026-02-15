import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartStoreItem } from '../cart/cart.storeitem';
import { UserService } from '../../user/services/user';
import { DeliveryAddress } from '../../types/cart.type';
import { Observable } from 'rxjs';
import { OrderItem } from '../../types/order.type';
import { OrderTypes } from '../../types/order.type';

@Injectable()
export class Order {
  constructor(
    private httpClient: HttpClient,
    private cartStore: CartStoreItem,
    private userService: UserService,
  ) {}

  saveOrder(deliveryAddress: DeliveryAddress, userEmail: string): Observable<any> {
    const url: string = 'http://localhost:5001/orders/add';
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
