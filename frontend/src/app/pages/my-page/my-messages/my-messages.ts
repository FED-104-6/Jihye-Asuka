import { Component } from '@angular/core';
import { Flat, FlatService } from '../../../services/flat.service';
import { CommonModule } from '@angular/common';
import { filter, forkJoin, Observable, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, MsgService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-messages',
  imports: [CommonModule],
  templateUrl: './my-messages.html',
  styleUrl: './my-messages.css',
})
export class Messages {
  // ⭐ forkJoin, groupby, Record 공부 더 하기

  currentUserId!: string;

  // Record<Type, Type>
  // Record는 일반 객체랑 구조는 같지만, 타입스크립트가 타입 체크를 엄격하게 해주는 것
  // 객체 초기화는 중괄호로 하는 게 좋다 -- key 접근을 위해
  inboxByFlat: Record<string, Message[]> = {};
  outboxByFlat: Record<string, Message[]> = {};

  inboxFlatIds: string[] = [];
  outboxFlatIds: string[] = [];

  constructor(
    private msgService: MsgService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (!user) return;
      this.currentUserId = user._id!;

      // forkJoin
      // RxJS에서 제공하는 연산자
      // 여러 Observable을 동시에 실행하고, 모두 완료될 때 결과를 한 번에 배열로 반환
      //결과 순서 보장 → 배열 순서 = 입력 Observable 순서
      // 한 번만 값 방출 → 모든 Observable이 완료되면 subscribe 호출
      // 에러 처리 → 중간 하나라도 에러 발생하면 전체 구독이 error 상태

      //실시간 스트리밍처럼 계속 값이 들어오는 Observable에는 forkJoin 사용하지 않음.
      // ajax 요청처럼 한 번만 완료되는 Observable에 적합
      forkJoin([
        this.msgService.getInboxById(this.currentUserId),
        this.msgService.getOutboxById(this.currentUserId),
      ]).subscribe(([inbox, outbox]) => {
        this.groupByFlat(inbox, 'inbox');
        this.groupByFlat(outbox, 'outbox');
      });
    });
  }

  private groupByFlat(msgs: Message[], type: 'inbox' | 'outbox') {
    const grouped: Record<string, Message[]> = {};

    msgs.forEach((msg) => {
      const flatId = (msg.flat as any)._id.toString();
      if (!grouped[flatId]) grouped[flatId] = [];
      grouped[flatId].push(msg);
    });

    Object.keys(grouped).forEach((flatId) => {
      grouped[flatId].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });

    if (type === 'inbox') {
      this.inboxByFlat = grouped;
      this.inboxFlatIds = Object.keys(grouped);
    } else {
      this.outboxByFlat = grouped;
      this.outboxFlatIds = Object.keys(grouped);
    }
  }
  isSenderMe(msg: Message): boolean {
    const senderId = (msg.sender as any)._id.toString();
    return senderId === this.currentUserId;
  }

  viewFlatDetail(flat: Flat) {
    if (!flat._id) return;
    window.location.href = `/flat/view/${flat._id}`;
  }
}
