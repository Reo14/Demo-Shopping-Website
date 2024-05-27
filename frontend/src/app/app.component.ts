import { Component, OnInit  } from '@angular/core';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Online Shopping System';

  constructor(private cartService: CartService, private authService: AuthService,) {}

  ngOnInit(): void {
    this.cartService.loadCartItems();
  }
}
