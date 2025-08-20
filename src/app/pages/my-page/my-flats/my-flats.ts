import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-flats',
  imports: [DatePipe, CommonModule],
  templateUrl: './my-flats.html',
  styleUrl: './my-flats.css'
})
export class MyFlats {
  //test Data
  myFlats = [
    {
      address: {
        stNum: 233,
        stName: 'Robson St',
        city: 'Vancouver BC'
      },
      size: 56,
      price: 24000,
      dateAvailable: '2025-08-16',
      img: '/assets/home.png'
    },
    {
      address: {
        stNum: 101,
        stName: 'Main St',
        city: 'Vancouver BC'
      },
      size: 70,
      price: 30000,
      dateAvailable: '2025-09-01',
      img: '/assets/home.png'
    }
  ];

  constructor(private router: Router) {}

  goToFlatEdit(flat: any) {
    this.router.navigate(['/flat-view', flat.id])
  }

  onDelete(flat: any) {
    //
  }
}
