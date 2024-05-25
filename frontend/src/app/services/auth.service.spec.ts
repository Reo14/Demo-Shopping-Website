import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

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
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const dummyResponse = { token: '123456', role: 'user', userId: '1' };
    const username = 'testUser';
    const password = 'testPass';

    service.login(username, password).subscribe(response => {
      expect(response.token).toBe(dummyResponse.token);
      expect(response.role).toBe(dummyResponse.role);
      expect(response.userId).toBe(dummyResponse.userId);
    });

    const req = httpMock.expectOne('http://localhost:4000/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);

    expect(localStorage.getItem('token')).toBe(dummyResponse.token);
    expect(localStorage.getItem('role')).toBe(dummyResponse.role);
    expect(localStorage.getItem('userId')).toBe(dummyResponse.userId);
  });

  it('should handle login error', () => {
    const username = 'testUser';
    const password = 'testPass';

    service.login(username, password).subscribe(
      () => fail('should have failed with the 500 error'),
      (error: any) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne('http://localhost:4000/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush('error', { status: 500, statusText: 'Server Error' });
  });

  it('should signup successfully', () => {
    const dummyResponse = { token: '123456', role: 'user' };
    const username = 'newUser';
    const password = 'newPass';
    const role = 'user';

    service.signup(username, password, role).subscribe(response => {
      expect(response.token).toBe(dummyResponse.token);
      expect(response.role).toBe(dummyResponse.role);
    });

    const req = httpMock.expectOne('http://localhost:4000/auth/signup');
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);

    expect(localStorage.getItem('token')).toBe(dummyResponse.token);
    expect(localStorage.getItem('role')).toBe(dummyResponse.role);
  });

  it('should handle signup error', () => {
    const username = 'newUser';
    const password = 'newPass';
    const role = 'user';

    service.signup(username, password, role).subscribe(
      () => fail('should have failed with the 500 error'),
      (error: any) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne('http://localhost:4000/auth/signup');
    expect(req.request.method).toBe('POST');
    req.flush('error', { status: 500, statusText: 'Server Error' });
  });

  it('should logout correctly', () => {
    localStorage.setItem('token', '123456');
    localStorage.setItem('role', 'user');
    localStorage.setItem('userId', '1');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(localStorage.getItem('userId')).toBeNull();
  });

  it('should return user role as observable', () => {
    const role = 'admin';
    localStorage.setItem('role', role);
    const result = service.getUserRole();
    result.subscribe(currentRole => {
      expect(currentRole).toBe(role);
    });
  });
});
