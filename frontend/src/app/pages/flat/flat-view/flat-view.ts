import { ChangeDetectorRef, Component } from '@angular/core';
import { Flat, FlatService } from '../../../services/flat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Message, MsgService } from '../../../services/message.service';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  firstValueFrom,
  map,
  switchMap,
} from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-flat-view',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './flat-view.html',
  styleUrl: './flat-view.css',
})
export class FlatView {
  currentFlat$!: Observable<Flat>;
  currentUser$!: Observable<User>;
  openOwnerInform$!: Observable<boolean>;
  showAlert = false;

  msgForm = new FormGroup({
    content: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private flatService: FlatService,
    private msgService: MsgService,
    private authService: AuthService,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    // 현재 로그인 유저 Observable
    this.currentUser$ = this.authService.currentUser$.pipe(
      filter((user): user is User => !!user)
    );

    // 현재 flat Observable
    this.currentFlat$ = this.flatService.getFlatById(id);

    // openOwnerInform Observable (현재 유저가 flat 소유자가 아닌 경우)
    this.openOwnerInform$ = combineLatest([
      this.currentFlat$,
      this.currentUser$,
    ]).pipe(map(([flat, user]) => flat.owner._id !== user._id));
  }

  // owner - edit
  goToEditPage(flatId: string) {
    window.location.href = `/flat/edit/${flatId}`;
  }

  // favorites
  getFavoriteIcon(flatId: string, user: User): string {
    const isMine = user.flats.some((flat) => flat._id === flatId);
    const isFavorite = user.favorites.some((fav) => fav._id === flatId);

    if (isMine) return '';
    return isFavorite ? '/assets/fav-yellow.png' : '/assets/fav-white.png';
  }
  setFavorite(flat: Flat, user: User) {
    const updatedFavorites = [...user.favorites];
    const index = updatedFavorites.findIndex((fav) => fav._id === flat._id);
    if (index >= 0) updatedFavorites.splice(index, 1);
    else updatedFavorites.push(flat);

    this.userService.updateFavorites(user._id!, updatedFavorites).subscribe({
      next: (updatedUser) => {
        this.authService.setUser(updatedUser);
        window.location.reload();
      },
      error: (err) => console.error(err),
    });
  }

  // send message
  get content() {
    return this.msgForm.get('content');
  }
  getFormErrors(): string {
    for (const field in this.msgForm.controls) {
      const control = this.msgForm.get(field);
      if (control?.errors) {
        if (control.errors['required']) return `Fill in the ${field} field.`;
      }
    }
    return '';
  }
  sendMessage(currentUser: User, currentFlat: Flat): void {
    if (!this.msgForm.valid) {
      alert(this.getFormErrors());
      return;
    }

    const formValue = this.msgForm.value;
    const newMsg: Message = {
      content: formValue.content ?? '',
      sender: currentUser,
      recipient: currentFlat.owner,
      createdAt: new Date(),
      flat: currentFlat,
    };

    this.msgService.createMsg(newMsg).subscribe({
      next: () => {
        this.showAlert = true;
        setTimeout(() => (this.showAlert = false), 3000);
        this.msgForm.reset();
      },
      error: (err) => console.error('Error sending message:', err),
    });
  }
}
