import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-flat',
  imports: [],
  templateUrl: './edit-flat.html',
  styleUrl: './edit-flat.css'
})
export class EditFlat {
editFlatForm = new FormGroup({
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
    if (this.editFlatForm.valid) {
      alert('Your flat has been successfully updated!');
    } else{
      alert('Please fill in all the required information')
    }
  }
}
