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
  // ⭐ forkJoin, groupby, Record 공부 더 하기

  currentUserId!: string;

  // Record<Type, Type>
  // Record는 일반 객체랑 구조는 같지만, 타입스크립트가 타입 체크를 엄격하게 해주는 것
  // 객체 초기화는 중괄호로 하는 게 좋다 -- key 접근을 위해
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
        // 서비스로 자식한테 전해줘야 됨
        this.msgService.setInbox(this.groupByFlat(inbox));
        this.msgService.setOutbox(this.groupByFlat(outbox));
      });
    });
  }

  private groupByFlat(messages: Message[]): Record<string, MessageGroup> {
    const grouped: Record<string, MessageGroup> = {};

    messages.forEach((msg) => {
      // flat이 populate된 객체라고 가정
      // - Record라는 이름의 객체에 넣을 필드값
      const flatId = msg.flat._id!;

      // - 필드 안에 넣을 컨텐츠 --> 객체
      // - id에 맞는 flat 글을 띄워야 되므로 객체에 flat 저장
      // - 그리고 이제 해당 글의 메세지를 객체에 배열로 담아 저장
      // - 따라서 string(글 Id) : object(글 내용Flat / 메세지[]) 이렇게 담기는 거임
      if (!grouped[flatId]) {
        grouped[flatId] = {
          flat: msg.flat, // 첫 메시지에서 flat 객체 가져옴
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
