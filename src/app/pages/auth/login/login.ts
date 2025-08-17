import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/login.service';

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

  // private auth: Auth = inject(Auth);             // ✅ 최신 방식으로 Auth 주입
  private router = inject(Router);
  private authService = inject(AuthService);

  // validation
  getFormErrors(): string {
    console.log("enter");
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

  login() {
  // async login() {
    this.errorMessage = this.getFormErrors();
    if (this.errorMessage) return;

  //   const email = this.loginForm.get('email')?.value?.trim() ?? '';
  //   const password = this.loginForm.get('password')?.value ?? '';

  //   try {
  //     const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
  //     const user = userCredential.user;

  //     if (user) {
  //       const displayName = user.displayName ?? email;
  //       alert(`Welcome ${displayName}`);
  //       this.router.navigate(['/home']);
        // this.authService.login();
  //     }
  //   } catch (error) {
  //     this.errorMessage = 'Email or password is incorrect.';
  //   }
  }
}
