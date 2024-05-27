import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { CartItem } from '../models/cart-item.models';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  const mockCartItems: CartItem[] = [
    { id: '1', productId: 'p1', userId: 'user1', quantity: 2, product: { id: 'p1', name: 'Product 1', price: 100, description: 'Desc 1', imageUrl: 'url1', stock: 10, updatedAt: new Date() }},
    { id: '2', productId: 'p2', userId: 'user1', quantity: 1, product: { id: 'p2', name: 'Product 2', price: 200, description: 'Desc 2', imageUrl: 'url2', stock: 20, updatedAt: new Date() }}
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear(); // 清除 localStorage
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load cart items', () => {
    localStorage.setItem('token', '12345');
    localStorage.setItem('userId', 'user1');
    
    service.loadCartItems();
    
    const req = httpMock.expectOne('http://localhost:4000/cart');
    expect(req.request.method).toBe('GET');
    req.flush(mockCartItems);

    service.cartItems$.subscribe(cartItems => {
      expect(cartItems.length).toBe(2);
    });
  });

  it('should get cart items for a user', () => {
    localStorage.setItem('token', '12345');
    const userId = 'user1';

    service.getCartItems(userId).subscribe(cartItems => {
      expect(cartItems.length).toBe(2);
      expect(cartItems[0].userId).toBe(userId);
    });

    const req = httpMock.expectOne('http://localhost:4000/cart');
    expect(req.request.method).toBe('GET');
    req.flush(mockCartItems);
  });

  it('should add to cart', () => {
    localStorage.setItem('token', '12345');
    const newCartItem = { id: '3', productId: 'p3', userId: 'user1', quantity: 1, product: { id: 'p3', name: 'Product 3', price: 300, description: 'Desc 3', imageUrl: 'url3', stock: 30, updatedAt: new Date() }};
    
    service.addToCart('p3', 1);
    
    const req = httpMock.expectOne('http://localhost:4000/cart');
    expect(req.request.method).toBe('POST');
    req.flush(newCartItem);

    
    
    service.cartItems$.subscribe(cartItems => {
      expect(cartItems.length).toBe(3);
    });
  });

  it('should update cart item', () => {
    localStorage.setItem('token', '12345');
    const updatedCartItem = { ...mockCartItems[0], quantity: 3 };

    service.updateCartItem('1', 3).subscribe(cartItem => {
      expect(cartItem.quantity).toBe(3);
    });

    const req = httpMock.expectOne('http://localhost:4000/cart/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedCartItem);

    

    service.cartItems$.subscribe(cartItems => {
      expect(cartItems[0].quantity).toBe(3);
    });
  });

  it('should remove from cart', () => {
    localStorage.setItem('token', '12345');

    service.removeFromCart('1').subscribe();

    const req = httpMock.expectOne('http://localhost:4000/cart/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    

    service.cartItems$.subscribe(cartItems => {
      expect(cartItems.length).toBe(1);
      expect(cartItems[0].id).toBe('2');
    });
  });

  it('should clear the cart', () => {
    localStorage.setItem('token', '12345');
    localStorage.setItem('userId', 'user1');

    service.clearCart();

    const req = httpMock.expectOne('http://localhost:4000/cart?userId=user1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    service.cartItems$.subscribe(cartItems => {
      expect(cartItems.length).toBe(0);
    });
  });
});
