import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

class MockAuthService {
  private roleSubject = new BehaviorSubject<string | null>(null);
  currentRole: string | null = null;  // 添加一个属性来保存当前角色

  getUserRole() {
    return this.roleSubject.asObservable();
  }

  setRole(role: string | null) {
    this.currentRole = role;  // 更新当前角色
    this.roleSubject.next(role);
  }

  logout() {
    this.setRole(null);
  }
}

class MockCartService {
  private cartTotalSubject = new BehaviorSubject<number>(0);

  getCartTotal() {
    return this.cartTotalSubject.asObservable();
  }

  setCartTotal(total: number) {
    this.cartTotalSubject.next(total);
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: MockAuthService;
  let cartService: MockCartService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: CartService, useClass: MockCartService }
      ],
      imports: [RouterTestingModule]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    cartService = TestBed.inject(CartService) as unknown as MockCartService;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should set isLoggedIn and isAdmin based on user role', () => {
    authService.setRole('admin');
    fixture.detectChanges();
    expect(component.isLoggedIn).toBe(true);
    expect(component.isAdmin).toBe(true);

    authService.setRole('user');
    fixture.detectChanges();
    expect(component.isLoggedIn).toBe(true);
    expect(component.isAdmin).toBe(false);

    authService.setRole(null);
    fixture.detectChanges();
    expect(component.isLoggedIn).toBe(false);
    expect(component.isAdmin).toBe(false);
  });

  it('should navigate to main page when backToMainPage is called', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.backToMainPage();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to auth page when onSignInOrOut is called and user is not logged in', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    authService.setRole(null);
    fixture.detectChanges();
    component.onSignInOrOut();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth']);
  });

  it('should log out and navigate to main page when onSignInOrOut is called and user is logged in', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    authService.setRole('user');
    fixture.detectChanges();
    component.onSignInOrOut();
    expect(authService.currentRole).toBe(null);
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
