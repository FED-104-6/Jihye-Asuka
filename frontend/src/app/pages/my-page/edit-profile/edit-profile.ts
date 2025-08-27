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
<<<<<<< HEAD
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
=======
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User, UserService } from '../../../services/user.service';
>>>>>>> dfcd12356210f6d6f13b19515aee762d49cbff54

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {
<<<<<<< HEAD
  updateForm = new FormGroup({
    firstName: new FormControl("", [
      Validators.required,
      Validators.minLength(2)
    ]),
    lastName: new FormControl("", [
      Validators.required,
      Validators.minLength(2)
    ]),
    email: new FormControl("", [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.pattern('^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};\'"\\|,.<>/?]).{6,}$')
    ]),
    confirmPassword: new FormControl("", [
      Validators.required
    ]),
    birthdate: new FormControl("", Validators.compose([
      Validators.required,
      EditProfile.ageRangeValidator
    ]))
  },
    { validators: EditProfile.passwordMatchValidator }
=======
  errorMessage = '';
  currentUser: User | null = null;
  whatAdminCanOnlySee: string | null = null;

  editUserForm = new FormGroup(
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
>>>>>>> dfcd12356210f6d6f13b19515aee762d49cbff54
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

    if (!userId) {
      this.authService.currentUser$.subscribe((loggedUser) => {
        if (loggedUser) {
          this.currentUser = loggedUser;
          this.editUserForm.patchValue({
            firstName: loggedUser.firstname,
            lastName: loggedUser.lastname,
            email: loggedUser.email,
            birthdate: loggedUser.birthdate
              ? new Date(loggedUser.birthdate).toISOString().split('T')[0]
              : '',
          });
        }
      });
    } else {
      this.userService.getUserById(userId).subscribe((user) => {
        if (user) {
          this.currentUser = user;
          this.editUserForm.patchValue({
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

  static passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }

  getFormErrors(): string {
    for (const field in this.editUserForm.controls) {
      const control = this.editUserForm.get(field);
      if (control?.errors) {
        if (control.errors['required']) return `Fill in the ${field} field.`;
        if (control.errors['email']) return 'The email format is invalid.';
        if (control.errors['minlength']) return 'The input is too short.';
        if (control.errors['pattern']) return 'Password format is invalid.';
      }
    }

    if (this.editUserForm.errors?.['passwordMismatch']) {
      return 'The password and confirm password do not match.';
    }
    return '';
  }

<<<<<<< HEAD
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    const currentUser = this.authService.getUser();

    if (currentUser) {
      this.updateForm.patchValue({
        firstName: currentUser.firstname,
        lastName: currentUser.lastname,
        email: currentUser.email,
        birthdate: new Date(currentUser.birthdate).toISOString().split('T')[0]
      });
    }
  }

  onSubmit() {
    console.log('onSubmit called');
    if (this.updateForm.invalid) return;

    const currentUser = this.authService.getUser();
    if (!currentUser) return;

    const updatedData = {
      firstname: this.updateForm.value.firstName || '',
      lastname: this.updateForm.value.lastName || '',
      email: this.updateForm.value.email || '',
      birthdate: this.updateForm.value.birthdate ? new Date(this.updateForm.value.birthdate) : undefined,
      password: this.updateForm.value.password || ''
    };

    this.userService.updateUser(currentUser._id!, updatedData).subscribe({
      next: (user) => {
        console.log('updateprofile:', updatedData)
        this.authService.setUser(user);
        this.router.navigate(['/home'])
      },
      error: (err) => {
        console.error('Failed to update profile', err);
        alert('Failed to update profile. Please try again.');
      }
    });
=======
  editProfile(): void {
    this.errorMessage = this.getFormErrors();
    if (this.errorMessage) return;

    if (this.editUserForm.valid) {
      const formValue = this.editUserForm.value;

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

      const nextCallback = (user: User) => {
        if (this.whatAdminCanOnlySee) {
          alert('edit: ' + user.firstname + ' as an admin');
          this.router.navigate(['/admin/all-users']);
        } else {
          this.authService.setUser(user);
          alert('edit: ' + user.firstname);
          window.location.href = '/home';
        }
      };

      this.userService.updateUser(updatedUser).subscribe({
        next: nextCallback,
        error: (err) => console.error('Error updating user:', err),
      });
    }
>>>>>>> dfcd12356210f6d6f13b19515aee762d49cbff54
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
