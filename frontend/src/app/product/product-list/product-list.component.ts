// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.models';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isAdmin = false;
  p: number = 1; // 当前页码
  itemsPerPage: number = 8; // 每页展示的产品数量
  sortedProducts: Product[] = [];

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
        this.sortedProducts = [...this.products]; // 初始化排序后的产品数组
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

  onSortChange(event: any): void {
    const sortValue = event.target.value;
    console.log('Sort by:', sortValue);

    if (sortValue === 'update') {
      this.sortedProducts.sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
    } else if (sortValue === 'price') {
      this.sortedProducts.sort((a, b) => a.price - b.price);
    }
  }

  addProduct(): void {
    console.log('Add product');
    // 导航到添加产品页面
    this.router.navigate(['/products/new']);
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


