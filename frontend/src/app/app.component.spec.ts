import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CartService } from './services/cart.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let cartService: CartService;

  beforeEach(async () => {
    const cartServiceMock = {
      loadCartItems: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: CartService, useValue: cartServiceMock }],
      schemas: [NO_ERRORS_SCHEMA] // Ignores unknown elements and attributes
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Online Shopping System'`, () => {
    expect(component.title).toEqual('Online Shopping System');
  });

  it('should call loadCartItems on init', () => {
    const loadCartItemsSpy = jest.spyOn(cartService, 'loadCartItems');
    component.ngOnInit();
    expect(loadCartItemsSpy).toHaveBeenCalled();
  });
});
