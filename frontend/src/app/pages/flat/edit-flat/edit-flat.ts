import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FlatService, Flat } from '../../../services/flat.service';
import { UserService, User } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-flat',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-flat.html',
  styleUrl: './edit-flat.css'
})

export class EditFlat {
  editFlatForm = new FormGroup({
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
    hasAC: new FormControl<boolean>(false, [
      Validators.required
    ]),
    price: new FormControl<number>(1000, [
      Validators.required,
      Validators.min(1)
    ]),
    size: new FormControl<number>(50, [
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

  get year() { return this.editFlatForm.get('year'); }
  get city() { return this.editFlatForm.get('city'); }
  get availDate() { return this.editFlatForm.get('availDate'); }
  get hasAC() { return this.editFlatForm.get('hasAC'); }
  get price() { return this.editFlatForm.get('price'); }
  get size() { return this.editFlatForm.get('size'); }
  get stNum() { return this.editFlatForm.get('stNum'); }
  get stName() { return this.editFlatForm.get('stName'); }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private flatService: FlatService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  flatId!: string;

  ngOnInit() {
    this.flatId = this.route.snapshot.paramMap.get('id')!;

    if (this.flatId) {
      this.flatService.getFlatById(this.flatId).subscribe(flat => {
        this.editFlatForm.patchValue({
          year: flat.year,
          city: flat.city,
          availDate: flat.availDate.toString().substring(0, 10),
          hasAC: flat.hasAC,
          price: flat.price,
          size: flat.size,
          stName: flat.stName,
          stNum: flat.stNum
        });
      });
    }
  }

  onSubmit() {
    if (this.editFlatForm.valid && this.flatId) {

      const currentUser = this.authService.getUser();
      if (!currentUser) return;

      const updatedFlat = {
        id: this.flatId,
        city: this.editFlatForm.value.city!,
        stName: this.editFlatForm.value.stName!,
        stNum: this.editFlatForm.value.stNum!,
        size: this.editFlatForm.value.size!,
        hasAC: this.editFlatForm.value.hasAC!,
        year: this.editFlatForm.value.year!,
        price: this.editFlatForm.value.price!,
        availDate: new Date(this.editFlatForm.value.availDate!),
        owner: currentUser as any
      }

      this.flatService.updateFlat(updatedFlat).subscribe({
        next: () => {
          alert('Your flat has been successfully updated!');
          this.router.navigate(['/home']);
        },
        error: err => {
          console.error(err);
          alert('Failed to update the flat.');
        }
      });
    } else {
      alert('Please fill in all the required information');
    }
  }
}
