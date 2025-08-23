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
import { User, UserService } from '../../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  errorMessage = '';
  newUser: User = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    birthdate: new Date(),
    type: ['buyer'],
    age: 0,
    admin: false,
    createdat: new Date(),
  };

  registerForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPw: new FormControl('', [Validators.required]),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      birthdate: new FormControl('', [Validators.required]),
    },
    {
      validators: Register.passwordMatchValidator,
    }
  );

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    const today = new Date().toISOString().split('T')[0];
    this.registerForm.patchValue({ birthdate: today });
  }

  static passwordMatchValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const originPw = group.get('password')?.value;
    const confirmPw = group.get('confirmPw')?.value;
    return originPw === confirmPw ? null : { passwordMismatch: true };
  }

  getFormErrors(): string {
    for (const field in this.registerForm.controls) {
      const control = this.registerForm.get(field);
      if (control && control.errors) {
        if (control.errors['required']) {
          return `Fill in the ${field} field.`;
        }
        if (control.errors['email']) {
          return 'The email format is invalid.';
        }
        if (control.errors['minlength']) {
          return 'The password should be at least 6 characters.';
        }
      }
    }

    if (this.registerForm.errors?.['passwordMismatch']) {
      return 'The password and confirm do not match.';
    }

    return '';
  }

  register() {
    this.errorMessage = this.getFormErrors();
    if (this.errorMessage) return;

    const formValues = this.registerForm.value;
    const firstname = formValues.firstname ?? '';
    const lastname = formValues.lastname ?? '';
    const email = formValues.email ?? '';
    const password = formValues.password ?? '';
    const birthdateStr = formValues.birthdate ?? new Date().toISOString();
    const birthdate = new Date(birthdateStr);

    this.newUser = {
      ...this.newUser,
      firstname,
      lastname,
      email,
      password,
      birthdate,
    };

    this.userService.createUser(this.newUser).subscribe({
      next: (user) => {
        console.log('Created user:', user);
        alert('welcome: ' + user.firstname);
        window.location.href = '/login';
      },
      error: (err) => {
        this.errorMessage = 'This email is already in use.';
      },
    });
  }
}
