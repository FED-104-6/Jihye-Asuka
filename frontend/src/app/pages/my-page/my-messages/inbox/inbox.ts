import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MessageGroup, MsgService } from '../../../../services/message.service';
import { Observable } from 'rxjs';
import { Flat } from '../../../../services/flat.service';

@Component({
  selector: 'app-inbox',
  imports: [CommonModule],
  templateUrl: './inbox.html',
  styleUrl: './inbox.css',
})
export class Inbox {
  inboxByFlat$: Observable<Record<string, MessageGroup>>;
  isMessageOpen = false;

  constructor(private msgState: MsgService) {
    this.inboxByFlat$ = this.msgState.inbox$;
  }

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  openModal() {
    this.isMessageOpen = true;

    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop =
          this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }

  viewFlatDetail(flat: Flat) {
    if (!flat._id) return;
    window.location.href = `/flat/view/${flat._id}`;
  }
}
