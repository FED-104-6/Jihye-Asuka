import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null); // 초기값 null
  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {
    // 서비스 생성 시 localStorage에서 token/userId 있으면 restore
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
  }

  logout() {
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

    // 서버에서 유저 정보 가져오기
    this.http.get<User>(`http://localhost:3000/users/${userId}`).subscribe({
      next: (user) => {
        this.currentUser.next(user); // BehaviorSubject에 값 업데이트
      },
      error: (err) => {
        console.error('Failed to restore user', err);
        this.currentUser.next(null);
      },
    });
  }
}

