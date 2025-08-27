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

@Component({
  selector: 'app-edit-flat',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-flat.html',
  styleUrl: './edit-flat.css',
})
export class EditFlat {
  errorMessage = '';
  currentFlat: Flat | null = null;

  editFlatForm = new FormGroup({
    stNum: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    stName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    city: new FormControl('', [Validators.required, Validators.minLength(2)]),
    price: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    size: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    hasAC: new FormControl(false, [Validators.required]),
    built: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    dateAvailable: new FormControl('', [Validators.required]),
  });

  constructor(
    private route: ActivatedRoute,
    private flatService: FlatService
  ) {}

  ngOnInit(): void {
    const flatId = this.route.snapshot.paramMap.get('id'); // URL --> /edit-flat/:id 
    if (!flatId) return;

    this.flatService.getFlatById(flatId).subscribe((flat) => {
      this.currentFlat = flat;

      this.editFlatForm.patchValue({
        built: flat.year,
        city: flat.city,
        dateAvailable: flat.availDate
          ? new Date(flat.availDate).toISOString().split('T')[0]
          : '',
        hasAC: flat.hasAC,
        price: flat.price,
        size: flat.size,
        stName: flat.stName,
        stNum: flat.stNum,
      });
    });
  }

  get built() {
    return this.editFlatForm.get('built');
  }
  get city() {
    return this.editFlatForm.get('city');
  }
  get dateAvailable() {
    return this.editFlatForm.get('dateAvailable');
  }
  get hasAC() {
    return this.editFlatForm.get('hasAC');
  }
  get price() {
    return this.editFlatForm.get('price');
  }
  get size() {
    return this.editFlatForm.get('size');
  }
  get stNum() {
    return this.editFlatForm.get('stNum');
  }
  get stName() {
    return this.editFlatForm.get('stName');
  }

  getFormErrors(): string {
    for (const field in this.editFlatForm.controls) {
      const control = this.editFlatForm.get(field);
      if (control?.errors) {
        if (control.errors['required']) return `Fill in the ${field} field.`;
        if (control.errors['min'])
          return `${field} must be at least ${control.errors['min'].min}`;
        if (control.errors['minlength']) return `${field} is too short.`;
      }
    }
    return '';
  }

  editFlat(): void {
    if (!this.currentFlat) return; 
    if (!this.editFlatForm.valid) {
      this.errorMessage = this.getFormErrors();
      return;
    }

    const formValue = this.editFlatForm.value;

    const updatedFlat: Partial<Flat> = {
      _id: this.currentFlat._id ?? '',
      year: formValue.built ?? 0,
      city: formValue.city ?? '',
      availDate: formValue.dateAvailable
        ? new Date(formValue.dateAvailable)
        : this.currentFlat.availDate ?? new Date(),
      hasAC: formValue.hasAC ?? false,
      price: formValue.price ?? 0,
      size: formValue.size ?? 0,
      stName: formValue.stName ?? '',
      stNum: formValue.stNum ?? 0,
    };

    this.flatService.updateFlat(updatedFlat).subscribe({
      next: () => {
        alert('edit complete!'), window.location.href = '/user/flats';
      },
      error: (err) => console.error('Error updating flat:', err),
    });
  }
}
