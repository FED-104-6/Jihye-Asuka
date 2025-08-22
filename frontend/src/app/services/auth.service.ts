import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.asObservable();
  isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));

  constructor() {
    // 안 하면 localstorage 없다고 ㅈㄹ함
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        this.currentUser.next(JSON.parse(user));
      }
    }
  }

  setUser(user: User) {
    this.currentUser.next(user);
  }
  getUser(): User | null {
    return this.currentUser.value;
  }

  login(token: string, user: User) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.currentUser.next(user);
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUser.next(null);
  }

  currentUserSnapshot(): User | null {
    return this.currentUser.value;
  }

  // 새로고침 시 localStorage에서 유저 복원
  restoreUser() {
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userJson && token) {
      const user: User = JSON.parse(userJson);
      this.currentUser.next(user);
    }
  }
}
