import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})

export class EditProfile {
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
      Validators.minLength(6),
      //passwordStrengthValidator
    ]),
    birthdate: new FormControl("", [
      Validators.required,
      //ageRangeValidator
    ])
  })
  get firstName() { return this.updateForm.get('firstName'); }
get lastName() { return this.updateForm.get('lastName'); }
get email() { return this.updateForm.get('email'); }
get password() { return this.updateForm.get('password'); }
get birthdate() { return this.updateForm.get('birthdate'); }

  // function  passwordStrengthValidator {
    
  // }

  // function  ageRangeValidator {
    
  // }


  onSubmit() {
    if (this.updateForm.valid) {
      //
    }
  }
}
