import { TestBed } from '@angular/core/testing';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { isObservable } from 'rxjs';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authService: AuthService;
  let router: Router;

  const mockRouterState: RouterStateSnapshot = {
    url: '/admin',
  } as RouterStateSnapshot;

  const mockActivatedRouteSnapshot: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AdminGuard,
        {
          provide: AuthService,
          useValue: {
            getUserRole: jest.fn()
          }
        }
      ]
    });

    guard = TestBed.inject(AdminGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow the admin user to activate route', (done) => {
    jest.spyOn(authService, 'getUserRole').mockReturnValue(of('admin'));

    const result = guard.canActivate(mockActivatedRouteSnapshot, mockRouterState);
    
    if (isObservable(result)) {
      result.subscribe((res) => {
        expect(res).toBe(true);
        done();
      });
    } else {
      expect(result).toBe(true);
      done();
    }
  });

  it('should not allow non-admin user to activate route and navigate to home', (done) => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    jest.spyOn(authService, 'getUserRole').mockReturnValue(of('user'));

    const result = guard.canActivate(mockActivatedRouteSnapshot, mockRouterState);

    if (isObservable(result)) {
      result.subscribe((res) => {
        expect(res).toBe(false);
        expect(navigateSpy).toHaveBeenCalledWith(['/']);
        done();
      });
    } else {
      expect(result).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/']);
      done();
    }
  });
});
