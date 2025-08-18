import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { MyFavorites } from './pages/my-page/my-favorites/my-favorites';
import { MyFlats } from './pages/my-page/my-flats/my-flats';
import { MyProfile } from './pages/my-page/my-profile/my-profile';
import { EditProfile } from './pages/my-page/edit-profile/edit-profile';
import { NewFlat } from './pages/flat/new-flat/new-flat';
import { Admin } from './pages/admin/admin';
import { AllUsers } from './pages/admin/all-users/all-users';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'my-favorites', component: MyFavorites },
  { path: 'my-flats', component: MyFlats },
  { path: 'my-profile', component: MyProfile },
  { path: 'edit-profile', component: EditProfile },

  { path: 'new-flat', component: NewFlat },

  {
    path: 'admin',
    component: Admin,
    children: [
      { path: 'all-users', component: AllUsers }, // 하위 페이지
    ],
  },
];
