import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  isLoginMode = true;

  constructor(private fb: FormBuilder, private router: Router) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    console.log('AuthComponent initialized');
    console.log('Form Valid:', this.authForm.valid);
    console.log('Email Valid:', this.authForm.get('email')?.valid);
    console.log('Password Valid:', this.authForm.get('password')?.valid);
  }

  onSubmit() {
    console.log('Form Submitted');
    if (this.authForm.invalid) {
      console.log('Form Invalid:', this.authForm.errors);
      console.log('Email Errors:', this.authForm.get('email')?.errors);
      console.log('Password Errors:', this.authForm.get('password')?.errors);
      return;
    }

    if (this.isLoginMode) {
      // 登录逻辑
      this.login();
    } else {
      // 注册逻辑
      this.signup();
    }
  }

  login() {
    // 执行登录操作
    console.log('登录');
    // 假设登录成功后，跳转到首页
    this.router.navigate(['/']);
  }

  signup() {
    // 执行注册操作
    console.log('注册');
    // 假设注册成功后，跳转到首页
    this.router.navigate(['/']);
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    console.log('Switched Mode:', this.isLoginMode);
  }
}
