import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  productId: string | null = null;
  isAdmin = false;
  imagePreview: string | null = null;
  

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.authService.getUserRole().subscribe(role => {
      this.isAdmin = role === 'admin';
    });

    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.loadProduct(this.productId);
      }
    });

    this.productForm.get('imageUrl')!.valueChanges.subscribe(() => {
      this.updateImagePreview();
    });
  }

  loadProduct(id: string): void {
    console.log(`Fetching product with ID: ${id}`);

    this.productService.getProduct(id).subscribe(
      (product: Product) => {
        this.productForm.patchValue(product);
        this.updateImagePreview();
      },
      error => {
        console.error('Error loading product:', error);
      }
    );
  }

  updateImagePreview(): void {
    this.imagePreview = this.productForm.get('imageUrl')!.value;
  }

  
  
  

  onSubmit(): void {
    if (this.productForm.valid) {
      if (this.productId) {
        this.productService.updateProduct(this.productId, this.productForm.value).subscribe(
          () => {
            console.log('Product updated successfully');
            this.router.navigate(['/']);
          },
          error => {
            console.error('Error updating product:', error);
          }
        );
      } else {
        this.productService.createProduct(this.productForm.value).subscribe(
          () => {
            console.log('Product created successfully');
            this.router.navigate(['/']);
          },
          error => {
            console.error('Error creating product:', error);
          }
        );
      }
    }
  }

  onDelete(): void {
    if (this.productId && confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.productId).subscribe(
        () => this.router.navigate(['/products']),
        error => console.error('Error deleting product:', error)
      );
    }
  }
}
