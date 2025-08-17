import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  imports: [],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css'
})

export class MyProfile {
  firstName: string = "Asuka";
  lastName: string = "Fukuchi";
  email: string = "abc123@gmail.com";
  birthDate = "1997/11/17";

  constructor(private router: Router) {}
  goToEditPage(){
    this.router.navigate(['/edit-profile'])
  }
}
