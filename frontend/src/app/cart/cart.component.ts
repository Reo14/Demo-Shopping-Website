import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart-item.models';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(
      (data: CartItem[]) => {
        this.cartItems = data;
        this.calculateTotalPrice();
      },
      (error: any) => {
        console.error('Error loading cart items', error);
      }
    );
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0);
  }

  updateQuantity(productId: string | undefined, event: Event): void {
    if (!productId) return;
    const inputElement = event.target as HTMLInputElement;
    const updatedQuantity = Number(inputElement.value);
    if (updatedQuantity <= 0) {
      this.removeFromCart(productId);
    } else {
      const item = this.cartItems.find(i => i.product.id === productId);
      if (item) {
        item.quantity = updatedQuantity;
        this.cartService.updateCartItem(productId, updatedQuantity).subscribe(
          () => {
            this.calculateTotalPrice();
          },
          (error: any) => {
            console.error('Error updating cart item', error);
          }
        );
      }
    }
  }

  removeFromCart(productId: string): void {
    console.log('Removing product with ID:', productId); // 添加日志以调试
    this.cartService.removeFromCart(productId).subscribe(
      () => {
        this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
        this.calculateTotalPrice();
      },
      (error: any) => {
        console.error('Error removing cart item', error);
      }
    );
  }
}
