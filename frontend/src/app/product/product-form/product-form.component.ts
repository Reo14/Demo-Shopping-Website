import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.models';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['']
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
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
