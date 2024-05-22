import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.models';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  sortedProducts: Product[] = [];
  isAdmin = false;
  itemsPerPage = 8;
  p = 1;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (products) => {
        this.products = products;
        this.sortedProducts = products; // Initialize sortedProducts
        console.log('Products loaded:', this.products);
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );

    this.authService.getUserRole().subscribe(role => {
      this.isAdmin = role === 'admin';
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product.id);
    console.log(`Product ${product.name} added to cart`);
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/products', product.id, 'detail']);
  }

  editProduct(product: Product): void {
    this.router.navigate(['/products', product.id, 'edit']);
  }

  addProduct(): void {
    this.router.navigate(['/products/new']);
  }

  onSortChange(event: any): void {
    const sortBy = event.target.value;
    if (sortBy === 'price') {
      this.sortedProducts = this.products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'updateTime') {
      this.sortedProducts = this.products.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else {
      this.sortedProducts = this.products;
    }
  }
}
