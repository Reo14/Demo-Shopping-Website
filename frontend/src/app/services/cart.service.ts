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

  private apiUrl = 'http://localhost:4000/cart'; // 确保路径是正确的

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // JWT存储在localStorage中
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  loadCartItems(): void {
    this.http.get<CartItem[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        tap(cartItems => this.cartItemsSubject.next(cartItems))
      )
      .subscribe({
        error: err => console.error('Error loading cart items', err) // 错误处理
      });
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  addToCart(productId: string, quantity: number = 1): void {
    this.http.post<CartItem>(this.apiUrl, { productId, quantity }, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => this.loadCartItems()) // 重新加载购物车项
      )
      .subscribe({
        error: err => console.error('Error adding to cart', err) // 错误处理
      });
  }

  updateCartItem(id: string, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/${id}`, { quantity }, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => this.loadCartItems()) // 重新加载购物车项
      );
  }

  removeFromCart(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => this.loadCartItems()) // 重新加载购物车项
      );
  }

  clearCart(): void {
    this.http.delete(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => this.cartItemsSubject.next([])) // 清空购物车项
      )
      .subscribe({
        error: err => console.error('Error clearing cart', err) // 错误处理
      });
  }
}
