import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from './user.service';

export interface Flat {
  _id?: string;
  city: string;
  stName: string;
  stNum: number;
  size: number;
  hasAC: boolean;
  year: number;
  price: number;
  availDate: Date;
  owner: User;
}

@Injectable({ providedIn: 'root' })
export class FlatService {
  private apiUrl = 'http://localhost:3000/flats';

  constructor(private http: HttpClient) {}

  getFlats(): Observable<Flat[]> {
    return this.http.get<Flat[]>(this.apiUrl);
  }
  getFlatById(id: string): Observable<Flat> {
    return this.http.get<Flat>(`${this.apiUrl}/${id}`);
  }
  getFlatsByUserId(userId: string): Observable<Flat[]> {
    const cleanId = userId.replace(/"/g, '');
    return this.http.get<Flat[]>(`${this.apiUrl}/owner/${cleanId}`);
  }

  createFlat(userId: string, newFlat: Flat): Observable<Flat> {
    const cleanId = userId.replace(/"/g, '');
    return this.http.post<Flat>(`${this.apiUrl}/create/${cleanId}`, newFlat);
  }
  updateFlat(flat: Partial<Flat>): Observable<Flat> {
    return this.http
      .patch<{ message: string; flat: Flat }>(
        `${this.apiUrl}/edit/${flat._id}`,
        flat // <-- (server) updates = { ...req.body };
      )
      .pipe(map((res) => res.flat));
  }
  deleteFlat(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
