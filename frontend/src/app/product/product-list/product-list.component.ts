import { Component, OnInit, AfterViewChecked, HostListener } from '@angular/core';
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
export class ProductListComponent implements OnInit, AfterViewChecked {
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
  ) {
    this.calculateItemsPerPage();
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (products) => {
        this.products = products;
        this.sortedProducts = products; // Initialize sortedProducts
        console.log('Products loaded:', this.products);
        this.adjustImageStyles(); // Adjust image styles after loading products
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );

    this.authService.getUserRole().subscribe(role => {
      this.isAdmin = role === 'admin';
    });

    this.calculateItemsPerPage();
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateItemsPerPage();
  }

  ngAfterViewChecked(): void {
    this.adjustImageStyles();
  }

  addToCart(product: Product): void {
    try {
      this.cartService.addToCart(product.id);
      console.log(`Product ${product.name} added to cart`);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  }

  viewProduct(product: Product): void {
    console.log(`Viewing product: ${product.name}`);
    this.router.navigate(['/products', product.id]);
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
    this.adjustImageStyles(); // Adjust image styles after sorting
  }

  onPageChange(pageNumber: number): void {
    this.p = pageNumber;
    setTimeout(() => {
      this.adjustImageStyles(); // Adjust image styles after page change
    }, 0);
  }

  private calculateItemsPerPage(): void {
    const width = window.innerWidth;
    let itemsPerRow;
    if (width >= 1200) {
      itemsPerRow = 4;
    } else if (width >= 900) {
      itemsPerRow = 3;
    } else if (width >= 600) {
      itemsPerRow = 2;
    } else {
      itemsPerRow = 1;
    }
    this.itemsPerPage = itemsPerRow * 2;
  }

  private adjustImageStyles(): void {
    setTimeout(() => {
      const productContainer = document.querySelector('.products-list') as HTMLElement;
      if (productContainer) {
        productContainer.style.width = '1000px';
      }

      const images = document.querySelectorAll('.product-item img') as NodeListOf<HTMLImageElement>;
      images.forEach((img: HTMLImageElement) => {
        img.style.height = '200px';
        img.style.marginBottom = '10px'; // Reapply margin-bottom
      });
    }, 0);
  }
}
