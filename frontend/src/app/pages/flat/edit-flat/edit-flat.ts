import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-flat',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-flat.html',
  styleUrl: './edit-flat.css'
})

export class EditFlat {
  editFlatForm = new FormGroup({
    built: new FormControl<number>(0, [
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
    price: new FormControl<number>(0, [
      Validators.required,
      Validators.min(0)
    ]),
    size: new FormControl<number>(0, [
      Validators.required,
      Validators.min(0)
    ]),
    stName: new FormControl("", [
      Validators.required,
      Validators.minLength(2)
    ]),
    stNum: new FormControl<number>(0, [
      Validators.required,
      Validators.min(0)
    ])
  })

  get built() { return this.editFlatForm.get('built'); }
  get city() { return this.editFlatForm.get('city'); }
  get dateAvailable() { return this.editFlatForm.get('dateAvailable'); }
  get hasAC() { return this.editFlatForm.get('hasAC'); }
  get price() { return this.editFlatForm.get('price'); }
  get size() { return this.editFlatForm.get('size'); }
  get stNum() { return this.editFlatForm.get('stNum'); }
  get stName() { return this.editFlatForm.get('stName'); }

  flatFromDB = {
    address: { 
      stNum: 233, 
      stName: 'Robson St', 
      city: 'Vancouver BC' 
    },
    price: 950,
    size: 60,
    hasAC: 'yes',
    built: 2012,
    dateAvailable: '2025-08-26'
  };

  ngOnInit() {
    this.editFlatForm.patchValue({
      stNum: this.flatFromDB.address.stNum,
      stName: this.flatFromDB.address.stName,
      city: this.flatFromDB.address.city,
      price: this.flatFromDB.price,
      size: this.flatFromDB.size,
      hasAC: this.flatFromDB.hasAC,
      built: this.flatFromDB.built,
      dateAvailable: this.flatFromDB.dateAvailable
    });
  }

  onSubmit() {
    if (this.editFlatForm.valid) {
      //TODO: update flatData to Database
      alert('Your flat has been successfully updated!');
    } else {
      alert('Please fill in all the required information')
    }
  }
}
