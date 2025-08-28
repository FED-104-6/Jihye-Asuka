import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  errorMessage = '';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  // validation
  getFormErrors(): string {
    for (const field in this.loginForm.controls) {
      const control = this.loginForm.get(field);
      if (control && control.errors) {
        if (control.errors['required']) {
          return `Fill in the ${field} field.`;
        }
        if (control.errors['email']) {
          return 'The email format is invalid.';
        }
      }
    }
    return '';
  }

  login(): void {
    this.errorMessage = this.getFormErrors();
    if (this.errorMessage) return;

    const credentials = {
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? '',
    };

    this.userService.loginUser(credentials).subscribe({
      next: (res) => {
        this.authService.login(res.token, res.user);
        window.location.href = '/home';
      },
      error: (err) => {
        this.errorMessage = 'Invalid email or password.';
      },
    });
  }
}
