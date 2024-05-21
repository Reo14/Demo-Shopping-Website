import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  isLoginMode = true;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.authForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user'] // Default role, you can change based on your requirements
    });
  }

  ngOnInit() {
    console.log('AuthComponent initialized');
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    if (this.isLoginMode) {
      this.login();
    } else {
      this.signup();
    }
  }

  login() {
    const { username, password } = this.authForm.value;
    this.authService.login(username, password).subscribe(
      response => {
        console.log('Login successful', response);
        this.router.navigate(['/']);
      },
      error => {
        console.error('Login error', error);
      }
    );
  }

  signup() {
    const { username, password, role } = this.authForm.value;
    this.authService.signup(username, password, role).subscribe(
      response => {
        console.log('Signup successful', response);
        this.router.navigate(['/']);
      },
      error => {
        console.error('Signup error', error);
      }
    );
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    console.log('Switched Mode:', this.isLoginMode);
  }
}
