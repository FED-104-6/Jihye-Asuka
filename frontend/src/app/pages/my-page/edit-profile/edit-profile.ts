import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})

export class EditProfile {
  //TODO: get current user information from database to display user data for reducing user task
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
  );

  get firstName() { return this.updateForm.get('firstName'); }
  get lastName() { return this.updateForm.get('lastName'); }
  get email() { return this.updateForm.get('email'); }
  get password() { return this.updateForm.get('password'); }
  get confirmPassword() { return this.updateForm.get('confirmPassword'); }
  get birthdate() { return this.updateForm.get('birthdate'); }

  static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  static ageRangeValidator(control: FormControl): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }

    const today = new Date();
    const birthDate = new Date(control.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
    }

    if (age < 18 || age > 120) {
      return { ageRange: true };
    }
    return null;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }

  goToMyProfilePage() {
    this.router.navigate(['/my-profile'])
  }

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
        this.goToMyProfilePage();
      },
      error: (err) => {
        console.error('Failed to update profile', err);
        alert('Failed to update profile. Please try again.');
      }
    });
  }
}
