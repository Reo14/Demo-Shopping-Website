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
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  productId: string | null = null;
  editMode = false;  // 定义 editMode 属性

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: [''],
      stock: ['', Validators.required]  // 添加 stock 控件
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.editMode = true;  // 设置 editMode 为 true
      this.productService.getProduct(this.productId).subscribe(product => {
        this.productForm.patchValue(product);
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      if (this.productId) {
        this.productService.updateProduct(this.productId, this.productForm.value).subscribe(() => {
          this.router.navigate(['/']);
        });
      } else {
        this.productService.createProduct(this.productForm.value).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    }
  }
}
