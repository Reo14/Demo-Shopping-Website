// header.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn = false;
  isAdmin = false;
  private cartTotal = new BehaviorSubject<number>(0);

  constructor(private authService: AuthService, private router: Router, private CartService: CartService) {
    this.authService.getUserRole().subscribe(role => {
      this.isLoggedIn = !!role;
      this.isAdmin = role === 'admin';
    });
  }

  onSignInOrOut(): void {
    if (this.isLoggedIn) {
      this.authService.logout();
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/auth']);
    }
  }

  backToMainPage(): void {
    this.router.navigate(['/'])
  }

  /* getCartTotal(): Observable<number> {
    return this.cartTotal.asObservable();
  } */

  
}
