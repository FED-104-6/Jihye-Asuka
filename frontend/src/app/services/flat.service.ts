import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Flat {
  id: number;
  city: string;
  stName: string;
  stNum: number;
  size: number;
  hasAC: boolean;
  year: number;
  price: number;
  availDate: Date;
  userid: number;
}

@Injectable({ providedIn: 'root' })
export class FlatService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getFlats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/flats`);
  }
}
