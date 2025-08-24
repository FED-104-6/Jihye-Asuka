import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.service';
import { Flat } from './flat.service';

export interface Message {
  _id?: string;
  content: string;
  sender: string;
  recipient: string;
  flat: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class MsgService {
  private apiUrl = 'http://localhost:3000/msgs';

  constructor(private http: HttpClient) {}

  getInboxById(userId: string): Observable<Message[]> {
    const cleanId = userId.replace(/"/g, '');
    return this.http.get<Message[]>(`${this.apiUrl}/inbox/${cleanId}`);
  }
  getOutboxById(userId: string): Observable<Message[]> {
    const cleanId = userId.replace(/"/g, '');
    return this.http.get<Message[]>(`${this.apiUrl}/outbox/${cleanId}`);
  }

  createMsg(newMsg: Message): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}`, newMsg);
  }
}
