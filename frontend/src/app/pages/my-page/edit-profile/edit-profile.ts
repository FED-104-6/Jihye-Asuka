import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subject, take } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { User, UserService } from '../../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {
  errorMessage = '';
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  updateForm = new FormGroup(
    {
      firstName: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl<string | null>(null, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl<string | null>(null, [
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[\\W_]).{6,}$'),
      ]),
      confirmPassword: new FormControl<string | null>(null),
      birthdate: new FormControl<string | null>(
        null,
        Validators.compose([Validators.required])
      ),
    },
    { validators: passwordOptionalMatchValidator }
  );

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.updateForm.patchValue({
          firstName: user.firstname,
          lastName: user.lastname,
          email: user.email,
          birthdate: user.birthdate
            ? new Date(user.birthdate).toISOString().split('T')[0]
            : '',
        });
      }
    });
  }

  get firstName() {
    return this.updateForm.get('firstName');
  }
  get lastName() {
    return this.updateForm.get('lastName');
  }
  get email() {
    return this.updateForm.get('email');
  }
  get password() {
    return this.updateForm.get('password');
  }
  get confirmPassword() {
    return this.updateForm.get('confirmPassword');
  }
  get birthdate() {
    return this.updateForm.get('birthdate');
  }

  static passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }

  // static ageRangeValidator(
  //   control: FormControl
  // ): { [key: string]: any } | null {
  //   if (!control.value) return null;

  //   const today = new Date();
  //   const birthDate = new Date(control.value);
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   const month = today.getMonth() - birthDate.getMonth();

  //   if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  //   }

  //   return age < 18 || age > 120 ? { ageRange: true } : null;
  // }

  getFormErrors(): string {
    for (const field in this.updateForm.controls) {
      const control = this.updateForm.get(field);
      if (control?.errors) {
        if (control.errors['required']) return `Fill in the ${field} field.`;
        if (control.errors['email']) return 'The email format is invalid.';
        if (control.errors['minlength']) return 'The input is too short.';
        if (control.errors['pattern']) return 'Password format is invalid.';
      }
    }

    if (this.updateForm.errors?.['passwordMismatch']) {
      return 'The password and confirm password do not match.';
    }
    return '';
  }

  editProfile(): void {
    this.errorMessage = this.getFormErrors();
    if (this.errorMessage) return;

    if (this.updateForm.valid) {
      const formValue = this.updateForm.value;

      const updatedUser: Partial<User> = {
        _id: this.currentUser?._id,
        firstname: formValue.firstName ?? '',
        lastname: formValue.lastName ?? '',
        email: formValue.email ?? '',
        password: formValue.password ?? '',
        birthdate: formValue.birthdate
          ? new Date(formValue.birthdate)
          : undefined,
      };

      this.userService.updateUser(updatedUser).subscribe({
        next: (user) => {
          this.authService.setUser(user);
          alert('edit: ' + user.firstname);
          this.router.navigate(['/home']);
        },
        error: (err) => console.error('Error creating user:', err),
      });
    }
  }
}

export function passwordOptionalMatchValidator(formGroup: AbstractControl) {
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;

  if (!password) {
    return null;
  }

  if (!confirmPassword) {
    return { confirmRequired: true };
  }

  if (password !== confirmPassword) {
    return { passwordMismatch: true };
  }

  return null;
}
