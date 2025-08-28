import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, forkJoin, Observable, switchMap } from 'rxjs';
import {
  Message,
  MessageGroup,
  MsgService,
} from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-messages',
  imports: [CommonModule, RouterModule],
  templateUrl: './my-messages.html',
  styleUrl: './my-messages.css',
})
export class Messages {
  currentUserId!: string;

  inboxByFlat: Record<string, MessageGroup> = {};
  outboxByFlat: Record<string, MessageGroup> = {};

  constructor(
    private msgService: MsgService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (!user) return;
      this.currentUserId = user._id!;

      forkJoin([
        this.msgService.getInboxById(this.currentUserId),
        this.msgService.getOutboxById(this.currentUserId),
      ]).subscribe(([inbox, outbox]) => {
        this.msgService.setInbox(this.groupByFlat(inbox));
        this.msgService.setOutbox(this.groupByFlat(outbox));
      });
    });
  }

  private groupByFlat(messages: Message[]): Record<string, MessageGroup> {
    const grouped: Record<string, MessageGroup> = {};

    messages.forEach((msg) => {
      const flatId = msg.flat._id!;

      if (!grouped[flatId]) {
        grouped[flatId] = {
          flat: msg.flat, 
          messages: [],
        };
      }

      grouped[flatId].messages.push(msg);
    });

    return grouped;
  }
  isSenderMe(msg: Message): boolean {
    const senderId = msg.sender._id;
    return senderId === this.currentUserId;
  }
}
