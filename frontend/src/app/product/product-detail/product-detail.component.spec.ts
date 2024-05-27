import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute } from '@angular/router';
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
}

class MockCartService {
  addToCart(productId: string) {
    console.log(`Product with ID ${productId} added to cart`);
  }
}

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let mockProductService: MockProductService;
  let mockCartService: MockCartService;
  let activatedRouteStub = { snapshot: { paramMap: { get: (key: string) => '1' } } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductDetailComponent],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: CartService, useClass: MockCartService },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    mockProductService = TestBed.inject(ProductService) as unknown as MockProductService;
    mockCartService = TestBed.inject(CartService) as unknown as MockCartService;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Mock console.log
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  it('should create the product detail component', () => {
    expect(component).toBeTruthy();
  });

  it('should load product details on init', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.product).toEqual({
      id: '1',
      name: 'Test Product',
      price: 100,
      description: 'This is a test product',
      imageUrl: 'http://example.com/image.jpg',
      stock: 10,
      updatedAt: expect.any(Date)
    } as Product);
  });

  it('should add product to cart', () => {
    const addToCartSpy = jest.spyOn(mockCartService, 'addToCart');
    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 100,
      description: 'This is a test product',
      imageUrl: 'http://example.com/image.jpg',
      stock: 10,
      updatedAt: new Date()
    };
    component.addToCart(product);
    expect(addToCartSpy).toHaveBeenCalledWith('1');
    expect(console.log).toHaveBeenCalledWith('Product Test Product added to cart');
  });
});
