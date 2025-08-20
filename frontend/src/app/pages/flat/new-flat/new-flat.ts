import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-flat',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-flat.html',
  styleUrl: './new-flat.css'
})

export class NewFlat {
  newFlatForm = new FormGroup({
    built: new FormControl("", [
      Validators.required,
      Validators.min(0)
    ]),
    city: new FormControl("", [
      Validators.required,
      Validators.minLength(2)
    ]),
    dateAvailable: new FormControl("", [
      Validators.required
    ]),
    hasAC: new FormControl("", [
      Validators.required
    ]),
    price: new FormControl("", [
      Validators.required,
      Validators.min(0)
    ]),
    size: new FormControl("", [
      Validators.required,
      Validators.min(0)
    ]),
    stName: new FormControl("", [
      Validators.required,
      Validators.minLength(2)
    ]),
    stNum: new FormControl("", [
      Validators.required,
      Validators.min(0)
    ])
  })

  get built() { return this.newFlatForm.get('built'); }
  get city() { return this.newFlatForm.get('city'); }
  get dateAvailable() { return this.newFlatForm.get('dateAvailable'); }
  get hasAC() { return this.newFlatForm.get('hasAC'); }
  get price() { return this.newFlatForm.get('price'); }
  get size() { return this.newFlatForm.get('size'); }
  get stNum() { return this.newFlatForm.get('stNum'); }
  get stName() { return this.newFlatForm.get('stName'); }

  constructor(private router: Router) { }
  goToHomePage() {
    this.router.navigate(['/home'])
  }

  onSubmit() {
    if (this.newFlatForm.valid) {
      //TODO: Save new flat data into database
      alert('Your flat has been successfully registered!');
      this.goToHomePage()
    } else {
      alert('Please fill in all the required information')
    }
  }
}
