import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isLoggedIn = false;

  constructor(private router: Router) {}

  mypage() {
    if(this.isLoggedIn) {
      this.router.navigate(['/mypage']);
    } else {
      this.router.navigate(['/login'])
    }
  }
}
