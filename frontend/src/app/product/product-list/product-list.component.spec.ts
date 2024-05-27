import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Product } from '../../models/product.models';
import { NgxPaginationModule } from 'ngx-pagination';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockProductService {
  getProducts() {
    return of([
      {
        id: '1',
        name: 'Product 1',
        price: 100,
        description: 'Description 1',
        imageUrl: 'http://example.com/image1.jpg',
        stock: 10,
        updatedAt: new Date('2021-01-01')
      },
      {
        id: '2',
        name: 'Product 2',
        price: 200,
        description: 'Description 2',
        imageUrl: 'http://example.com/image2.jpg',
        stock: 20,
        updatedAt: new Date('2021-02-01')
      }
    ] as Product[]);
  }
}

class MockCartService {
  addToCart(productId: string) {
    console.log(`Product with ID ${productId} added to cart`);
  }
}

class MockAuthService {
  getUserRole() {
    return of('admin');
  }
}

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: MockProductService;
  let mockCartService: MockCartService;
  let mockAuthService: MockAuthService;
  let mockRouter = { navigate: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: CartService, useClass: MockCartService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: mockRouter }
      ],
      imports: [NgxPaginationModule],
      schemas: [NO_ERRORS_SCHEMA]  // Ignore Angular elements we are not testing
    }).compileComponents();

    mockProductService = TestBed.inject(ProductService) as unknown as MockProductService;
    mockCartService = TestBed.inject(CartService) as unknown as MockCartService;
    mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the product list component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.products.length).toBe(2);
    expect(component.sortedProducts.length).toBe(2);
  });

  it('should add product to cart', () => {
    const addToCartSpy = jest.spyOn(mockCartService, 'addToCart');
    const product: Product = {
      id: '1',
      name: 'Product 1',
      price: 100,
      description: 'Description 1',
      imageUrl: 'http://example.com/image1.jpg',
      stock: 10,
      updatedAt: new Date('2021-01-01')
    };
    component.addToCart(product);
    expect(addToCartSpy).toHaveBeenCalledWith('1');
  });

  it('should navigate to product detail on viewProduct', () => {
    const product: Product = {
      id: '1',
      name: 'Product 1',
      price: 100,
      description: 'Description 1',
      imageUrl: 'http://example.com/image1.jpg',
      stock: 10,
      updatedAt: new Date('2021-01-01')
    };
    component.viewProduct(product);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products', '1']);
  });

  it('should navigate to edit product on editProduct', () => {
    const product: Product = {
      id: '1',
      name: 'Product 1',
      price: 100,
      description: 'Description 1',
      imageUrl: 'http://example.com/image1.jpg',
      stock: 10,
      updatedAt: new Date('2021-01-01')
    };
    component.editProduct(product);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products', '1', 'edit']);
  });

  it('should navigate to add new product on addProduct', () => {
    component.addProduct();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/products/new']);
  });

  /* it('should sort products by price', () => {
    component.onSortChange({ target: { value: 'price' } });
    expect(component.sortedProducts[0].price).toBe(100);
    component.onSortChange({ target: { value: 'price' } });
    expect(component.sortedProducts[0].price).toBe(200);
  });

  it('should sort products by update time', () => {
    component.onSortChange({ target: { value: 'updateTime' } });
    expect(component.sortedProducts[0].updatedAt).toEqual(new Date('2021-01-01'));
    component.onSortChange({ target: { value: 'updateTime' } });
    expect(component.sortedProducts[0].updatedAt).toEqual(new Date('2021-02-01'));
  }); */

  it('should calculate items per page based on window width', () => {
    global.innerWidth = 1200;
    component.calculateItemsPerPage();
    expect(component.itemsPerPage).toBe(8);

    global.innerWidth = 900;
    component.calculateItemsPerPage();
    expect(component.itemsPerPage).toBe(6);

    global.innerWidth = 600;
    component.calculateItemsPerPage();
    expect(component.itemsPerPage).toBe(4);

    global.innerWidth = 500;
    component.calculateItemsPerPage();
    expect(component.itemsPerPage).toBe(2);
  });

  it('should update image styles after view checked', () => {
    const adjustImageStylesSpy = jest.spyOn<any, any>(component as any, 'adjustImageStyles');
    component.ngAfterViewChecked();
    expect(adjustImageStylesSpy).toHaveBeenCalled();
  });
});
