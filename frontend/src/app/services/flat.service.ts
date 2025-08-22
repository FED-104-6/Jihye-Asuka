import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  user: string; // User의 ObjectId
}

@Injectable({ providedIn: 'root' })
export class FlatService {
  private apiUrl = 'http://localhost:3000/flats';

  constructor(private http: HttpClient) {}

  getFlats(): Observable<Flat[]> {
    return this.http.get<Flat[]>(this.apiUrl);
  }
}
