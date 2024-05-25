import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthComponent } from './auth.component';
import { of, throwError } from 'rxjs';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn().mockReturnValue(of({})),
      signup: jest.fn().mockReturnValue(of({}))
    };
    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize authForm with default values', () => {
    expect(component.authForm.value).toEqual({
      username: '',
      password: '',
      role: 'user'
    });
  });

  it('should switch mode correctly', () => {
    expect(component.isLoginMode).toBe(true);
    component.switchMode();
    expect(component.isLoginMode).toBe(false);
  });

  it('should not submit form if invalid', () => {
    const spy = jest.spyOn(component, 'login');
    component.onSubmit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call login if in login mode and form is valid', () => {
    component.isLoginMode = true;
    component.authForm.setValue({ username: 'test', password: 'password', role: 'user' });
    const spy = jest.spyOn(component, 'login');
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call signup if not in login mode and form is valid', () => {
    component.isLoginMode = false;
    component.authForm.setValue({ username: 'test', password: 'password', role: 'user' });
    const spy = jest.spyOn(component, 'signup');
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('should navigate to home on successful login', () => {
    authServiceMock.login.mockReturnValue(of({}));
    component.authForm.setValue({ username: 'test', password: 'password', role: 'user' });
    component.login();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle login error', () => {
    authServiceMock.login.mockReturnValue(throwError('error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    component.authForm.setValue({ username: 'test', password: 'password', role: 'user' });
    component.login();
    expect(consoleSpy).toHaveBeenCalledWith('Login error', 'error');
  });

  it('should navigate to home on successful signup', () => {
    authServiceMock.signup.mockReturnValue(of({}));
    component.authForm.setValue({ username: 'test', password: 'password', role: 'user' });
    component.signup();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle signup error', () => {
    authServiceMock.signup.mockReturnValue(throwError('error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    component.authForm.setValue({ username: 'test', password: 'password', role: 'user' });
    component.signup();
    expect(consoleSpy).toHaveBeenCalledWith('Signup error', 'error');
  });
});
