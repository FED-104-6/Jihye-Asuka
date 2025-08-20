import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
      Validators.pattern('^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,}$')
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


  constructor(private router: Router) { }
  goToMyProfilePage() {
    this.router.navigate(['/my-profile'])
  }

  onSubmit() {
    if (this.updateForm.valid) {
      //TODO: Update User information to database
      this.goToMyProfilePage()
    }
  }
}
