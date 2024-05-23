// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRoleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    const role = localStorage.getItem('role'); // 假设角色信息保存在localStorage中
    if (role) {
      this.userRoleSubject.next(role);
    }
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ token: string, role: string, userId: string }>(
      'http://localhost:4000/auth/login', 
      { username, password }, 
      { headers }
    ).pipe(
      tap(response => {
        console.log('Login response:', response); // 打印完整的响应对象
        if (response && response.role) {
          this.userRoleSubject.next(response.role);
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('role', response.role); // 保存角色信息
        } else {
          console.error('Login response missing role:', response);
        }
      })
    );
  }

  signup(username: string, password: string, role: string = 'user'): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ token: string, role: string }>(
      'http://localhost:4000/auth/signup', 
      { username, password, role }, 
      { headers }
    ).pipe(
      tap(response => {
        if (response && response.role) {
          this.userRoleSubject.next(response.role);
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role); // 保存角色信息
        } else {
          console.error('Signup response missing role:', response);
        }
      })
    );
  }

  logout() {
    this.userRoleSubject.next('');
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // 移除角色信息
  }

  getUserRole(): Observable<string> {
    return this.userRoleSubject.asObservable();
  }
}
