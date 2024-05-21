// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.models';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    console.log('ProductListComponent initialized');
    this.productService.getProducts().subscribe(
      products => {
        console.log('Products fetched successfully:', products);
        this.products = products;
        // Logging products to verify data binding
        console.log('Products assigned to component:', this.products);
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }
}
