import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn = false; // 模拟用户登录状态

  constructor(private router: Router) {}

  handleAuthAction() {
    if (this.isLoggedIn) {
      this.signOut();
    } else {
      this.signIn();
    }
  }

  signIn() {
    // 跳转到登录页面
    this.router.navigate(['/auth']);
  }

  signOut() {
    // 执行登出逻辑
    this.isLoggedIn = false;
    console.log('登出');
  }
}
