import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Product } from '../../models/product.models';

class MockProductService {
  getProduct(productId: string) {
    return of({
      id: productId,
      name: 'Test Product',
      price: 100,
      description: 'This is a test product',
      imageUrl: 'http://example.com/image.jpg',
      stock: 10,
      updatedAt: new Date()
    } as Product);
  }

  createProduct(product: Product) {
    return of(null);
  }

  updateProduct(productId: string, product: Product) {
    return of(null);
  }

  deleteProduct(productId: string) {
    return of(null);
  }
}

class MockAuthService {
  getUserRole() {
    return of('admin');
  }
}

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockProductService: MockProductService;
  let mockAuthService: MockAuthService;
  let mockRouter = { navigate: jest.fn() };
  let activatedRouteStub = { paramMap: of({ get: () => '1' }) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    mockProductService = TestBed.inject(ProductService) as unknown as MockProductService;
    mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the product form component', () => {
    expect(component).toBeTruthy();
  });

  it('should load product details on init', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.productForm.value).toEqual({
      name: 'Test Product',
      description: 'This is a test product',
      price: 100,
      imageUrl: 'http://example.com/image.jpg',
      stock: 10
    });
    expect(component.imagePreview).toBe('http://example.com/image.jpg');
  });

  it('should update product on submit if productId is set', () => {
    component.productId = '1';
    component.productForm.setValue({
      name: 'Updated Product',
      description: 'Updated description',
      price: 200,
      imageUrl: 'http://example.com/updated-image.jpg',
      stock: 20
    });

    const updateProductSpy = jest.spyOn(mockProductService, 'updateProduct');
    component.onSubmit();
    expect(updateProductSpy).toHaveBeenCalledWith('1', component.productForm.value);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should create product on submit if productId is not set', () => {
    component.productId = null;
    component.productForm.setValue({
      name: 'New Product',
      description: 'New description',
      price: 300,
      imageUrl: 'http://example.com/new-image.jpg',
      stock: 30
    });

    const createProductSpy = jest.spyOn(mockProductService, 'createProduct');
    component.onSubmit();
    expect(createProductSpy).toHaveBeenCalledWith(component.productForm.value);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should delete product on delete', () => {
    component.productId = '1';
    const deleteProductSpy = jest.spyOn(mockProductService, 'deleteProduct');
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    component.onDelete();
    expect(deleteProductSpy).toHaveBeenCalledWith('1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
  });
});
