import { Component } from '@angular/core';
import { Flat, FlatService } from '../../../services/flat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Message, MsgService } from '../../../services/message.service';
import { firstValueFrom } from 'rxjs';
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
  currentFlat?: Flat;
  currentUser: User | null = null;
  openOwnerInform = false;
  showAlert = false;

  msgForm = new FormGroup({
    content: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private flatService: FlatService,
    private msgService: MsgService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.flatService.getFlatById(id).subscribe({
        next: (data) => {
          this.currentFlat = data;
        },
        error: (err) => console.error(err),
      });
    }

    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;

        // after knowing user
        this.openOwnerInform = this.currentUser.flats.some(
          (flat) => flat._id !== this.currentFlat?._id
        );
      }
    });
  }

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
  sendMessage(): void {
    if (!this.currentUser) {
      alert('login first');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.msgForm.valid) {
      alert(this.getFormErrors());
      return;
    }

    const formValue = this.msgForm.value;

    const newMsg: Message = {
      content: formValue.content ?? '',
      sender: this.currentUser._id!,
      recipient: this.currentFlat?.owner._id!,
      createdAt: new Date(),
      flat: this.currentFlat?._id!,
    };

    this.msgService.createMsg(newMsg).subscribe({
      next: (msg) => {
        this.showAlert = true;
        setTimeout(() => (this.showAlert = false), 3000); // 3초 후 DOM에서 제거
        this.msgForm.reset();
        this.msgForm.reset();
      },
      error: (err) => console.error('Error making flat:', err),
    });
  }
}
