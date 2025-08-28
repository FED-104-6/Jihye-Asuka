import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from './user.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null); // Initialize with null
  currentUser$ = this.currentUser.asObservable();
  private logoutTimer: any;

  constructor(private http: HttpClient) {
    // On service creation, restore the user session if token and userId exist in localStorage
    this.restoreUser();
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
      localStorage.setItem('userId', user._id!);
    }
    this.currentUser.next(user);
    this.startLogoutTimer(token);
  }

  restoreSession() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      const user: User = { _id: userId } as User;
      this.currentUser.next(user);
      this.startLogoutTimer(token);
    }
  }

  private startLogoutTimer(token: string) {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);

    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp * 1000; // s → ms
      const now = Date.now();
      const timeout = exp - now;

      if (timeout > 0) {
        this.logoutTimer = setTimeout(() => {
          this.logout();
          alert('Session expired. Please log in again.');
          window.location.href = '/login';
        }, timeout);
      }
    } catch (err) {
      console.error('JWT decode error', err);
      this.logout();
    }
  }

  logout() {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
    this.currentUser.next(null);
  }

  currentUserSnapshot(): User | null {
    return this.currentUser.value;
  }

  restoreUser() {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) return;

    this.http.get<User>(`http://localhost:3000/users/${userId}`).subscribe({
      next: (user) => {
        this.currentUser.next(user);
        this.startLogoutTimer(token);
      },
      error: (err) => {
        console.error('Failed to restore user', err);
        this.currentUser.next(null);
      },
    });
  }
}
