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
import { EditFlat } from './pages/flat/edit-flat/edit-flat';
import { FlatView } from './pages/flat/flat-view/flat-view';
import { Messages } from './pages/my-page/my-messages/my-messages';
import { Inbox } from './pages/my-page/my-messages/inbox/inbox';
import { Outbox } from './pages/my-page/my-messages/outbox/outbox';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'user/favorites', component: MyFavorites },
  { path: 'user/flats', component: MyFlats },
  {
    path: 'user/messages',
    component: Messages, 
    children: [
      { path: 'inbox', component: Inbox },
      { path: 'outbox', component: Outbox },
      { path: '', redirectTo: 'inbox', pathMatch: 'full' }, // 기본 진입시 inbox 보여주기
    ],
  },
  { path: 'user/profile', component: MyProfile },
  { path: 'user/edit', component: EditProfile },

  { path: 'flat/create', component: NewFlat },
  { path: 'flat/edit/:id', component: EditFlat },
  { path: 'flat/view/:id', component: FlatView },

  { path: 'admin/profile/:id', component: MyProfile },
  { path: 'admin/edit/:id', component: EditProfile },
  {
    path: 'admin',
    component: Admin,
    children: [{ path: 'all-users', component: AllUsers }],
  },
];
