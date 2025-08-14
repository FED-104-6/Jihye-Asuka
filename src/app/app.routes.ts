import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { MyPage } from './pages/my-page/my-page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  {path: 'login', component: Login},
  {path: 'register', component: Register},
  {path: 'mypage', component: MyPage},
];
