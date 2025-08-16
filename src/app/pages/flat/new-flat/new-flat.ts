import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-flat',
  imports: [ReactiveFormsModule],
  templateUrl: './new-flat.html',
  styleUrl: './new-flat.css'
})

export class NewFlat {
  newFlatForm = new FormGroup({
    built: new FormControl("", [
      Validators.required
    ]),
    city: new FormControl("", [
      Validators.required
    ]),
    dateAvailable: new FormControl("", [
      Validators.required
    ]),
    hasAC: new FormControl("", [
      Validators.required
    ]),
    price: new FormControl("", [
      Validators.required
    ]),
    size: new FormControl("", [
      Validators.required
    ]),
    stName: new FormControl("", [
      Validators.required
    ]),
    stNum: new FormControl("", [
      Validators.required
    ])
  })

  onSubmit() {
    if (this.newFlatForm.valid) {
      alert('Your flat has been successfully registered!');
    } else{
      alert('Please fill in all the required information')
    }
  }
}
