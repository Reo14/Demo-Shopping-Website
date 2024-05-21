// header.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn = false;
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) {
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

  

  addProduct(): void {
    console.log('Add product');
    // 实现添加产品逻辑
  }
}
