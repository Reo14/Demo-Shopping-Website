import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.models';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  private apiUrl = 'http://localhost:4000/cart'; // Ensure the path is correct

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // JWT stored in localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private getUserId(): string {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID is not available');
    }
    return userId;
  }

  loadCartItems(): void {
    const userId = this.getUserId();
    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    this.http.get<CartItem[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        tap(cartItems => this.cartItemsSubject.next(cartItems))
      )
      .subscribe({
        error: err => console.error('Error loading cart items', err) // Error handling
      });
  }

  getCartItems(userId: string): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(cartItems => {
          this.cartItemsSubject.next(cartItems.filter(item => item.userId === userId));
        })
      );
  }

  addToCart(productId: string, quantity: number = 1): void {
    const payload = { productId, quantity };
    console.log('Adding to cart:', payload); // Add logging
    this.http.post<CartItem>(this.apiUrl, payload, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => this.loadCartItems()) // Reload cart items
      )
      .subscribe({
        error: err => console.error('Error adding to cart', err) // Error handling
      });
  }

  updateCartItem(id: string, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/${id}`, { quantity }, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => this.loadCartItems()) // Reload cart items
      );
  }

  removeFromCart(id: string): Observable<void> {
    console.log('Sending DELETE request to:', `${this.apiUrl}/${id}`); // Add logging for debugging
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => this.loadCartItems()) // Reload cart items
      );
  }

  clearCart(): void {
    this.http.delete(`${this.apiUrl}?userId=${this.getUserId()}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => this.cartItemsSubject.next([])) // Clear cart items
      )
      .subscribe({
        error: err => console.error('Error clearing cart', err) // Error handling
      });
  }
}

