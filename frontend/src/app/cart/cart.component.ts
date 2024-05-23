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

  private getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  

  loadCartItems(): void {

    const userId = this.getUserId();
    if (!userId) {
      console.error('User ID is not available');
      return;
    }
    
    this.cartService.getCartItems(userId).subscribe(
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

  updateQuantity(id: string, event: Event): void {
    if (!id) return;
    const inputElement = event.target as HTMLInputElement;
    const updatedQuantity = Number(inputElement.value);
    if (updatedQuantity <= 0) {
      this.removeFromCart(id);
    } else {
      const item = this.cartItems.find(i => i.id === id);
      if (item) {
        item.quantity = updatedQuantity;
        this.cartService.updateCartItem(id, updatedQuantity).subscribe(
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

  removeFromCart(id: string): void {
    console.log('Removing cart item with ID:', id); // Add logging for debugging
    this.cartService.removeFromCart(id).subscribe(
      () => {
        this.cartItems = this.cartItems.filter(item => item.id !== id);
        this.calculateTotalPrice();
      },
      (error: any) => {
        console.error('Error removing cart item', error);
      }
    );
  }
}
