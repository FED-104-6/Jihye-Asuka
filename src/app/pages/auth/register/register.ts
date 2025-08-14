import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
// import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
// import { AuthService } from '../../../services/login.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  
  email = '';
  password = '';
  confirmPw = '';
  firstname = '';
  lastname = '';
  birthdate = '';
  errorMessage = '';
  
  ngOnInit() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  this.registerForm.patchValue({
    birthdate: today
  });
}

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPw: new FormControl('', [Validators.required]),
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    birthdate: new FormControl('', [Validators.required]),
  }, {
    // validators: Register.passwordMatchValidator,
  });

  // ✅ 최신 방식으로 Auth 등 DI
  // private auth = inject(Auth);
  // private router = inject(Router);
  // private authService = inject(AuthService);

  // static passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  //   const originPw = group.get('password')?.value;
  //   const confirmPw = group.get('confirmPw')?.value;
  //   return originPw === confirmPw ? null : { passwordMismatch: true };
  // }

  // getFormErrors(): string {
  //   for (const field in this.registerForm.controls) {
  //     const control = this.registerForm.get(field);
  //     if (control && control.errors) {
  //       if (control.errors['required']) {
  //         return `Fill in the ${field} field.`;
  //       }
  //       if (control.errors['email']) {
  //         return 'The email format is invalid.';
  //       }
  //       if (control.errors['minlength']) {
  //         return 'The password should be at least 6 characters.';
  //       }
  //     }
  //   }

  //   if (this.registerForm.errors?.['passwordMismatch']) {
  //     return 'The password and confirm do not match.';
  //   }

  //   return '';
  // }

  register() {
  // async register() {
    // this.errorMessage = this.getFormErrors();
    // if (this.errorMessage) return;

    // const email = this.registerForm.get('email')?.value?.trim() ?? '';
    // const password = this.registerForm.get('password')?.value ?? '';
    // const firstname = this.registerForm.get('firstname')?.value ?? '';
    // const lastname = this.registerForm.get('lastname')?.value ?? '';

    // try {
    //   const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    //   const user = userCredential.user;

    //   if (user) {
    //     // ✅ 최신 modular API에서 updateProfile은 Auth에서 가져와야 함
    //     await updateProfile(user, { displayName: `${firstname} ${lastname}` });

    //     alert('Welcome. Please log in again.');
    //     this.router.navigate(['/login']);
    //   }
    // } catch (error: any) {
    //   console.error(error); // for debugging
    //   this.errorMessage = 'Register failed.';
    // }
  }
}
