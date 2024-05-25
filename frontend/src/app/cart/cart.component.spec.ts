import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../services/cart.service';
import { of, throwError } from 'rxjs';
import { CartItem } from '../models/cart-item.models';
import { Product } from '../models/product.models';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartServiceMock: any;

  beforeEach(async () => {
    cartServiceMock = {
      getCartItems: jest.fn().mockReturnValue(of([])),
      updateCartItem: jest.fn().mockReturnValue(of(null)),
      removeFromCart: jest.fn().mockReturnValue(of(null))
    };

    await TestBed.configureTestingModule({
      declarations: [CartComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CartService, useValue: cartServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart items on init', () => {
    const products: Product[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', price: 100, stock: 10, updatedAt: new Date() },
      { id: '2', name: 'Product 2', description: 'Description 2', price: 200, stock: 20, updatedAt: new Date() }
    ];
    const cartItems: CartItem[] = [
      { id: '1', userId: 'user1', productId: '1', quantity: 1, product: products[0] },
      { id: '2', userId: 'user1', productId: '2', quantity: 2, product: products[1] }
    ];
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('user1');
    cartServiceMock.getCartItems.mockReturnValue(of(cartItems));

    component.ngOnInit();

    expect(cartServiceMock.getCartItems).toHaveBeenCalledWith('user1');
    expect(component.cartItems).toEqual(cartItems);
    expect(component.totalPrice).toBe(500);
  });

  it('should handle error while loading cart items', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('user1');
    cartServiceMock.getCartItems.mockReturnValue(throwError('Error'));

    component.ngOnInit();

    expect(cartServiceMock.getCartItems).toHaveBeenCalledWith('user1');
    expect(component.cartItems).toEqual([]);
  });

  it('should update quantity of a cart item', () => {
    const product: Product = { id: '1', name: 'Product 1', description: 'Description 1', price: 100, stock: 10, updatedAt: new Date() };
    const cartItems: CartItem[] = [
      { id: '1', userId: 'user1', productId: '1', quantity: 1, product }
    ];
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('user1');
    cartServiceMock.getCartItems.mockReturnValue(of(cartItems));
    cartServiceMock.updateCartItem.mockReturnValue(of(null));

    component.ngOnInit();

    // Create a mock event object
    const mockEvent = {
      target: { value: '2' },
      bubbles: true,
      cancelable: true,
      composed: true,
      currentTarget: null,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: true,
      preventDefault: jest.fn(),
      stopImmediatePropagation: jest.fn(),
      stopPropagation: jest.fn(),
      timeStamp: Date.now(),
      type: 'input',
      initEvent: jest.fn()
    } as unknown as Event;

    component.updateQuantity('1', mockEvent);

    expect(cartServiceMock.updateCartItem).toHaveBeenCalledWith('1', 2);
    expect(component.cartItems[0].quantity).toBe(2);
    expect(component.totalPrice).toBe(200);
  });

  it('should remove a cart item', () => {
    const product: Product = { id: '1', name: 'Product 1', description: 'Description 1', price: 100, stock: 10, updatedAt: new Date() };
    const cartItems: CartItem[] = [
      { id: '1', userId: 'user1', productId: '1', quantity: 1, product }
    ];
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('user1');
    cartServiceMock.getCartItems.mockReturnValue(of(cartItems));
    cartServiceMock.removeFromCart.mockReturnValue(of(null));

    component.ngOnInit();
    component.removeFromCart('1');

    expect(cartServiceMock.removeFromCart).toHaveBeenCalledWith('1');
    expect(component.cartItems.length).toBe(0);
    expect(component.totalPrice).toBe(0);
  });
});
