import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user.service';
import { Flat } from './flat.service';

export interface MessageGroup {
  flat: Flat;
  messages: Message[];
}

export interface Message {
  _id?: string;
  content: string;
  sender: User;
  recipient: User;
  flat: Flat;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class MsgService {
  // send children
  private inboxSubject = new BehaviorSubject<Record<string, MessageGroup>>({});
  private outboxSubject = new BehaviorSubject<Record<string, MessageGroup>>({});

  inbox$ = this.inboxSubject.asObservable();
  outbox$ = this.outboxSubject.asObservable();

  setInbox(inbox: Record<string, MessageGroup>) {
    this.inboxSubject.next(inbox);
  }

  setOutbox(outbox: Record<string, MessageGroup>) {
    this.outboxSubject.next(outbox);
  }

  // server
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
