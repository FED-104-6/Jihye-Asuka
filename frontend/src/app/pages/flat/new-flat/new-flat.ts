import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlatService, Flat } from '../../../services/flat.service';
import { UserService, User } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-new-flat',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-flat.html',
  styleUrl: './new-flat.css'
})

export class NewFlat {
  newFlatForm = new FormGroup({
    year: new FormControl<number>(2000, [
      Validators.required,
      Validators.min(1800)
    ]),
    city: new FormControl("", [
      Validators.required,
      Validators.minLength(2)
    ]),
    availDate: new FormControl("", [
      Validators.required
    ]),
    hasAC: new FormControl<boolean | null>(null, [
      Validators.required
    ]),
    price: new FormControl<number>(1000, [
      Validators.required,
      Validators.min(1)
    ]),
    size: new FormControl<number>(1, [
      Validators.required,
      Validators.min(1)
    ]),
    stName: new FormControl("", [
      Validators.required,
      Validators.minLength(2)
    ]),
    stNum: new FormControl<number>(1, [
      Validators.required,
      Validators.min(1)
    ])
  })

  get year() { return this.newFlatForm.get('year'); }
  get city() { return this.newFlatForm.get('city'); }
  get availDate() { return this.newFlatForm.get('availDate'); }
  get hasAC() { return this.newFlatForm.get('hasAC'); }
  get price() { return this.newFlatForm.get('price'); }
  get size() { return this.newFlatForm.get('size'); }
  get stNum() { return this.newFlatForm.get('stNum'); }
  get stName() { return this.newFlatForm.get('stName'); }

  constructor(
    private router: Router,
    private flatService: FlatService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  goToHomePage() {
    this.router.navigate(['/home'])
  }

  onSubmit() {
    if (this.newFlatForm.valid) {
      const currentUser = this.authService.getUser() as any;

      const newFlat: Flat = {
        city: this.newFlatForm.value.city!,
        stName: this.newFlatForm.value.stName!,
        stNum: this.newFlatForm.value.stNum!,
        size: this.newFlatForm.value.size!,
        hasAC: this.newFlatForm.value.hasAC!,
        year: this.newFlatForm.value.year!,
        price: this.newFlatForm.value.price!,
        availDate: new Date(this.newFlatForm.value.availDate!),
        owner: currentUser as any
      };
      
      this.flatService.addFlat(newFlat).subscribe({
        next: () => {
          alert('Your flat has been successfully registered!');
          this.goToHomePage();
        },
        error: (err) => console.error(err)
      });
    } else {
      alert('Please fill in all the required information')
    }
  }
}
