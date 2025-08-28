import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  Message,
  MessageGroup,
  MsgService,
} from '../../../../services/message.service';
import { map, Observable, take } from 'rxjs';
import { Flat } from '../../../../services/flat.service';

@Component({
  selector: 'app-outbox',
  imports: [CommonModule],
  templateUrl: './outbox.html',
  styleUrl: './outbox.css',
})
export class Outbox {
  outboxByFlat$: Observable<Record<string, MessageGroup>>;
  messageContent: Message[] | null = null;
  isMessageOpen = false;

  constructor(private msgState: MsgService) {
    this.outboxByFlat$ = this.msgState.outbox$;
  }

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  openModal(flatId: string, event: Event) {
    event.stopPropagation();

    this.outboxByFlat$
      .pipe(
        take(1),
        map((outbox) => outbox[flatId]?.messages ?? []) 
      )
      .subscribe((messages) => {
        this.messageContent = messages; 
        this.isMessageOpen = true;

        setTimeout(() => {
          if (this.scrollContainer) {
            this.scrollContainer.nativeElement.scrollTop =
              this.scrollContainer.nativeElement.scrollHeight;
          }
        }, 0);
      });
  }

  viewFlatDetail(flat: Flat) {
    if (!flat._id) return;
    window.location.href = `/flat/view/${flat._id}`;
  }
}
