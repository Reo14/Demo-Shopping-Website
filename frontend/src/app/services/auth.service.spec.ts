import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear(); // 清除 localStorage
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with user role from localStorage', () => {
    localStorage.setItem('role', 'admin');
    const newService = TestBed.inject(AuthService);
    newService.getUserRole().subscribe(role => {
      expect(role).toBe('admin');
    });
  });

  it('should login and set user role', () => {
    const mockResponse = {
      token: '12345',
      role: 'admin',
      userId: 'user123'
    };

    service.login('testuser', 'password').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
      expect(localStorage.getItem('role')).toBe(mockResponse.role);
      expect(localStorage.getItem('userId')).toBe(mockResponse.userId);
      service.getUserRole().subscribe(role => {
        expect(role).toBe(mockResponse.role);
      });
    });

    const req = httpMock.expectOne('http://localhost:4000/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should signup and set user role', () => {
    const mockResponse = {
      token: '12345',
      role: 'user'
    };

    service.signup('testuser', 'password', 'user').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
      expect(localStorage.getItem('role')).toBe(mockResponse.role);
      service.getUserRole().subscribe(role => {
        expect(role).toBe(mockResponse.role);
      });
    });

    const req = httpMock.expectOne('http://localhost:4000/auth/signup');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout and clear user role', () => {
    localStorage.setItem('token', '12345');
    localStorage.setItem('role', 'admin');
    localStorage.setItem('userId', 'user123');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(localStorage.getItem('userId')).toBeNull();

    service.getUserRole().subscribe(role => {
      expect(role).toBe('');
    });
  });

  it('should return user role as observable', () => {
    service.getUserRole().subscribe(role => {
      expect(role).toBe('');
    });

    service.login('testuser', 'password').subscribe();

    const req = httpMock.expectOne('http://localhost:4000/auth/login');
    const mockResponse = {
      token: '12345',
      role: 'admin',
      userId: 'user123'
    };
    req.flush(mockResponse);

    service.getUserRole().subscribe(role => {
      expect(role).toBe('admin');
    });
  });
});
