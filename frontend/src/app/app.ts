import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-react');

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.restoreUser();
  }

  get showHeader() {
    const url = this.router.url;
    return !(
      url === '/login' ||
      url === '/register' ||
      url.startsWith('/admin')
    );
  }
  get showFooter() {
    const url = this.router.url;
    return !url.startsWith('/admin');
  }
}
