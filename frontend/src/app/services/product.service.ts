import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:4000/products';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let token = localStorage.getItem('token');
    if (!token) {
      const defaultToken = 'default-token';
      localStorage.setItem('token', defaultToken);
      token = localStorage.getItem('token');
    }
    console.log('Token:', token);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getProducts(): Observable<Product[]> {
    console.log('GET Request to:', this.baseUrl);
    return this.http.get<Product[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product, { headers: this.getHeaders() });
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product, { headers: this.getHeaders() });
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }
}
