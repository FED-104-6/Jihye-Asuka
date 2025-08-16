import { Component } from '@angular/core';
//import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  imports: [],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css'
})

export class MyProfile {
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  birthDate = "";

  //constructor(private router: Router) {}
  goToEditPage(){
    //this.router.navigate(['/edit-profile'])
  }
}
