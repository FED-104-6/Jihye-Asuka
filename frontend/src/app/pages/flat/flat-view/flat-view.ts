import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-flat-view',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './flat-view.html',
  styleUrl: './flat-view.css'
})
export class FlatView {
  //TODO: get flat information from database to display it
  flat = {
    address: {
      stNum: 233,
      stName: 'Robson St',
      city: 'Vancouver BC'
    },
    price: 950,
    size: 60,
    hasAC: 'Yes',
    built: 2012,
    dateAvailable: '2025-08-26',
    owner: {
      email: 'owner@example.com'
    },
    isFavorite: false
  };

  toggleFavorite(){
    this.flat.isFavorite = !this.flat.isFavorite;
    //TODO: save or remove depend on the value
  }
}
