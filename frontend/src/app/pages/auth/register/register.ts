import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserService } from '../../../services/user.service';
import { Flat } from '../../../services/flat.service';

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
    flats: [] as Flat[],
    favorites: [] as Flat[],
  };

  registerForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        passwordStrengthValidator(),
      ]),
      confirmPw: new FormControl('', [Validators.required]),
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
      adminkey: new FormControl(''),
    },
    {
      validators: Register.passwordMatchValidator,
    }
  );

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const today = new Date().toISOString().split('T')[0];
    this.registerForm.patchValue({ birthdate: today });

    const adminkey = this.route.snapshot.queryParamMap.get('adminkey');
    if (adminkey) {
      this.registerForm.patchValue({ adminkey });
    }
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
          if (field === 'password') {
            return 'The password should be at least 6 characters.';
          } else if (field === 'firstname' || field === 'lastname') {
            return `${field} should be at least 2 characters.`;
          }
        }
        if (control.errors['weakPassword']) {
          return 'Password must include letters, numbers, and special characters.';
        }
        if (control.errors['ageInvalid']) {
          return 'Age must be between 18 and 120 years.';
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

    const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const firstname = capitalize(formValues.firstname ?? '');
    const lastname = capitalize(formValues.lastname ?? '');
    const email = formValues.email ?? '';
    const password = formValues.password ?? '';
    const birthdateStr = formValues.birthdate ?? new Date().toISOString();
    const birthdate = new Date(birthdateStr);

    // adminkey => admin true
    const isAdmin = formValues.adminkey === 'SuperSecretAdmin2025';

    this.newUser = {
      ...this.newUser,
      firstname,
      lastname,
      email,
      password,
      birthdate,
      admin: isAdmin,
    };

    this.userService.createUser(this.newUser).subscribe({
      next: (user) => {
        console.log('Registration successful / user:', user);
        alert(`Welcome: ${user.firstname}${isAdmin ? ' (Admin)' : ''}`);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = 'This email is already in use.';
        this.cd.detectChanges();
      },
    });
  }
}

// password validator
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-\+]/.test(value);

    if (!hasLetter || !hasNumber || !hasSpecial) {
      return { weakPassword: true };
    }
    return null;
  };
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
