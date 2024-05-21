// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isAdmin = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (products) => {
        this.products = products;
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
    this.cartService.addToCart(product);
    console.log(`Product ${product.name} added to cart`);
  }

  editProduct(product: Product): void {
    console.log(`Edit product ${product.name}`);
    // 编辑产品的逻辑，可以导航到编辑页面
  }
}

