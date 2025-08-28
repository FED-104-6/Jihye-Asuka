import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  whatAdminCanOnlySee: string | null = null;

  editUserForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl(''),
      confirmPw: new FormControl(''),
      firstname: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastname: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      birthdate: new FormControl('', [
        Validators.required,
        ageValidator(18, 120),
      ]),
    },
    { validators: passwordOptionalMatchValidator }
  );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    this.whatAdminCanOnlySee = userId;

    const patchForm = (user: User) => {
      this.currentUser = user;
      this.editUserForm.patchValue({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        birthdate: user.birthdate
          ? new Date(user.birthdate).toISOString().split('T')[0]
          : '',
      });
    };

    if (!userId) {
      this.authService.currentUser$.subscribe((loggedUser) => {
        if (loggedUser) patchForm(loggedUser);
      });
    } else {
      this.userService.getUserById(userId).subscribe((user) => {
        if (user) patchForm(user);
      });
    }
  }

  get firstName() {
    return this.editUserForm.get('firstName');
  }
  get lastName() {
    return this.editUserForm.get('lastName');
  }
  get email() {
    return this.editUserForm.get('email');
  }
  get password() {
    return this.editUserForm.get('password');
  }
  get confirmPassword() {
    return this.editUserForm.get('confirmPassword');
  }
  get birthdate() {
    return this.editUserForm.get('birthdate');
  }

  getFormErrors(): string {
    for (const field in this.editUserForm.controls) {
      const control = this.editUserForm.get(field);
      if (!control?.errors) continue;

      if (control.errors['required']) return `Fill in the ${field} field.`;
      if (control.errors['email']) return 'The email format is invalid.';
      if (control.errors['minlength']) {
        if (field === 'password')
          return 'Password must be at least 6 characters.';
        return `${field} should be at least 2 characters.`;
      }
      if (control.errors['weakPassword'])
        return 'Password must include letters, numbers, and special characters.';
      if (control.errors['ageInvalid'])
        return 'Age must be between 18 and 120 years.';
    }

    if (this.editUserForm.errors?.['passwordMismatch']) {
      return 'The password and confirm password do not match.';
    }

    return '';
  }

  editProfile(): void {
    this.errorMessage = this.getFormErrors();
    if (this.errorMessage) return;

    if (this.editUserForm.valid) {
      const formValue = this.editUserForm.value;
      const updatedUser: Partial<User> = {
        _id: this.currentUser?._id,
        firstname: formValue.firstname ?? '',
        lastname: formValue.lastname ?? '',
        email: formValue.email ?? '',
        password: formValue.password || undefined,
        birthdate: formValue.birthdate
          ? new Date(formValue.birthdate)
          : undefined,
      };

      const nextCallback = (user: User) => {
        if (this.whatAdminCanOnlySee) {
          alert('User edit successfully: ' + user.firstname + ' as an admin');
          this.router.navigate(['/admin/all-users']);
        } else {
          this.authService.setUser(user);
          alert('User edit successfully: ' + user.firstname);
          window.location.href = '/home';
        }
      };

      this.userService.updateUser(updatedUser).subscribe({
        next: nextCallback,
        error: (err) => console.error('Error updating user:', err),
      });
    }
  }
}

// password optional validator
export function passwordOptionalMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPw = control.get('confirmPw')?.value;

  if (!password && !confirmPw) return null;

  const errors: ValidationErrors = {};

  if (password && password.length < 6) {
    errors['minlength'] = true;
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-\+]/.test(password);

  if (!hasLetter || !hasNumber || !hasSpecial) {
    errors['weakPassword'] = true;
  }

  if (password !== confirmPw) {
    errors['passwordMismatch'] = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

// age validator
export function ageValidator(minAge: number, maxAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age < minAge || age > maxAge) {
      return { ageInvalid: true };
    }

    return null;
  };
}
