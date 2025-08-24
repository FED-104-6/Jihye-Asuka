import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Flat, FlatService } from '../../../services/flat.service';
import { User } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-new-flat',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-flat.html',
  styleUrl: './new-flat.css',
})
export class NewFlat {
  errorMessage = '';
  currentUser: User | null = null;

  newFlatForm = new FormGroup({
    stNum: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    stName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    city: new FormControl('', [Validators.required, Validators.minLength(2)]),
    price: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    size: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    hasAC: new FormControl(false, [Validators.required]),
    built: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    dateAvailable: new FormControl('', [Validators.required]),
  });

  constructor(
    private flatService: FlatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  get built() {
    return this.newFlatForm.get('built');
  }
  get city() {
    return this.newFlatForm.get('city');
  }
  get dateAvailable() {
    return this.newFlatForm.get('dateAvailable');
  }
  get hasAC() {
    return this.newFlatForm.get('hasAC');
  }
  get price() {
    return this.newFlatForm.get('price');
  }
  get size() {
    return this.newFlatForm.get('size');
  }
  get stNum() {
    return this.newFlatForm.get('stNum');
  }
  get stName() {
    return this.newFlatForm.get('stName');
  }

  getFormErrors(): string {
    for (const field in this.newFlatForm.controls) {
      const control = this.newFlatForm.get(field);
      if (control?.errors) {
        if (control.errors['required']) return `Fill in the ${field} field.`;
        if (control.errors['min'])
          return `${field} must be at least ${control.errors['min'].min}`;
        if (control.errors['minlength']) return `${field} is too short.`;
      }
    }
    return '';
  }

  newFlat(): void {
    if (!this.currentUser) return;
    if (!this.newFlatForm.valid) {
      this.errorMessage = this.getFormErrors();
      return;
    }

    const formValue = this.newFlatForm.value;

    const newFlat: Flat = {
      stName: formValue.stName ?? '',
      stNum: formValue.stNum ?? 0,
      city: formValue.city ?? '',
      size: formValue.size ?? 0,
      price: formValue.price ?? 0,
      hasAC: formValue.hasAC ?? false,
      year: formValue.built ?? 0,
      availDate: formValue.dateAvailable
      ? new Date(formValue.dateAvailable)
      : new Date(),
      owner: this.currentUser
    };

    this.flatService.createFlat(this.currentUser._id!, newFlat).subscribe({
      next: () => {
        alert('add complete!'), (window.location.href = '/user/flats');
      },
      error: (err) => console.error('Error making flat:', err),
    });
  }
}
