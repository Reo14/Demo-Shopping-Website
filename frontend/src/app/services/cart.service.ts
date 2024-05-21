import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.models';
import { Product } from '../models/product.models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject(this.cartItems);

  constructor() {}

  getCartItems(): Observable<CartItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  addToCart(product: Product): void {
    const existingCartItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      const cartItem: CartItem = {
        product: product,
        quantity: 1
      };
      this.cartItems.push(cartItem);
    }
    this.cartItemsSubject.next(this.cartItems);
    console.log('Current cart items:', this.cartItems);
  }
}


