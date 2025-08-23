import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id?: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  birthdate: Date;
  createdat: Date;
  age?: number;
  type: string[];
  admin: boolean;
  flats?: any[]; // populate된 flats
  favorites?: any[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  createUser(newUser: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, newUser);
  }
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateAdminStatus(userId: string, admin: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}/admin`, { admin });
  }
  updateFavorites(userId: string, favorites: string[]): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}/favorites`, { favorites });
  }

  loginUser(credentials: {
    email: string;
    password: string;
  }): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(
      `${this.apiUrl}/login`,
      credentials
    );
  }

  updateUser(userId: string, updatedData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}/edit-profile`, updatedData);
  }
}
