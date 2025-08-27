import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserService } from '../../../services/user.service';
import { catchError, combineLatest, map, Observable, of } from 'rxjs';

function getAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // 아직 생일 안 지났으면 -1
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  return age;
}

@Component({
  selector: 'app-all-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './all-users.html',
  styleUrl: './all-users.css',
})
export class AllUsers {
  isFilterOpen = false;
  isUserSelected = false;
  selectedUser: User | null = null;

  // filter
  type: string[] = [];
  ageA: number | null = null;
  ageB: number | null = null;
  cntA: number | null = null;
  cntB: number | null = null;
  isAdmin: boolean | null = null;
  sort: string = '';

  users$!: Observable<User[]>;
  filteredItems$!: Observable<User[]>;

  sortOptions = [
    { value: 'fAtoZ', label: 'First Name (A-Z)' },
    { value: 'fZtoA', label: 'First Name (Z-A)' },
    { value: 'lAtoZ', label: 'Last Name (A-Z)' },
    { value: 'lZtoA', label: 'Last Name (Z-A)' },
    { value: 'cntLH', label: 'Flat Counter (Low to high)' },
    { value: 'cntHL', label: 'Flat Counter (High to low)' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // users observable
    this.users$ = this.userService.getUsers().pipe(
      map((data) =>
        data.map((user) => ({
          ...user,
          birthdate: new Date(user.birthdate),
          age: getAge(new Date(user.birthdate)),
        }))
      ),
      catchError((err) => {
        console.error(err);
        return of([] as User[]);
      })
    );

    // filteredItems observable
    this.filteredItems$ = combineLatest([
      this.users$,
      this.route.queryParams,
    ]).pipe(
      map(([users, params]) => {
        let result = [...users];

        this.type = params['type'] ? [].concat(params['type']) : [];
        this.ageA = params['ageA'] ? Number(params['ageA']) : null;
        this.ageB = params['ageB'] ? Number(params['ageB']) : null;
        this.cntA = params['cntA'] ? Number(params['cntA']) : null;
        this.cntB = params['cntB'] ? Number(params['cntB']) : null;
        this.isAdmin =
          params['isAdmin'] !== undefined ? params['isAdmin'] === 'true' : null;
        this.sort = params['sort'] || '';

        // filtering
        result = result.filter((user) => {
          const userAge = user.age ?? 0;
          const flatCnt = user.flats?.length ?? 0;

          const adminMatch =
            this.isAdmin === null || this.isAdmin === user.admin;
          const typeMatch =
            this.type.length === 0 ||
            this.type.every((t) => user.type.includes(t));

          const ageMatch =
            (this.ageA === null || userAge >= this.ageA) &&
            (this.ageB === null || userAge <= this.ageB);
          const cntMatch =
            (this.cntA === null || flatCnt >= this.cntA) &&
            (this.cntB === null || flatCnt <= this.cntB);

          return adminMatch && typeMatch && ageMatch && cntMatch;
        });

        // sorting
        const sortFuncs: Record<string, (a: User, b: User) => number> = {
          fAtoZ: (a, b) => a.firstname.localeCompare(b.firstname),
          fZtoA: (a, b) => b.firstname.localeCompare(a.firstname),
          lAtoZ: (a, b) => a.lastname.localeCompare(b.lastname),
          lZtoA: (a, b) => b.lastname.localeCompare(a.lastname),
          cntLH: (a, b) => (a.flats?.length ?? 0) - (b.flats?.length ?? 0),
          cntHL: (a, b) => (b.flats?.length ?? 0) - (a.flats?.length ?? 0),
        };

        if (sortFuncs[this.sort]) {
          result.sort(sortFuncs[this.sort]);
        }

        return result;
      })
    );
  }

  openUserProfile(user: User) {
    if (!user._id) return;
    this.router.navigate([`/admin/profile/${user._id}`]);
  }

  removeUser(user: User) {
    if (!user._id) return;
    if (!confirm('Are you sure?')) return;

    this.userService.deleteUser(user._id).subscribe({
      next: () => {
        this.users$ = this.users$.pipe(
          map((users) => users.filter((u) => u._id !== user._id))
        );
        window.location.reload();
      },
      error: (err) => console.error(err),
    });
  }

  toggleAdmin(user: User) {
    if (!user._id) return;
    if (!confirm('Are you sure?')) return;

    const newStatus = !user.admin;
    this.userService.updateAdminStatus(user._id, newStatus).subscribe({
      next: (updatedUser) => {
        this.users$ = this.users$.pipe(
          map((users) =>
            users.map((u) =>
              u._id === updatedUser._id ? { ...u, admin: updatedUser.admin } : u
            )
          )
        );
      },
      error: (err) => console.error(err),
    });
  }

  filterSetUsertype(type: string) {
    if (this.type.includes(type)) {
      this.type = this.type.filter((item) => item !== type);
    } else {
      this.type.push(type);
    }
  }
  filterSetAdmin(value: boolean) {
    this.isAdmin = value;
  }

  filterReset() {
    this.router.navigate([], { queryParams: {} });
  }

  filterApply() {
    const params: any = {};

    if (this.type && this.type.length > 0) {
      params.type = this.type;
    }
    if (this.ageA !== null && this.ageA !== undefined) {
      params.ageA = this.ageA;
    }
    if (this.ageB !== null && this.ageB !== undefined) {
      params.ageB = this.ageB;
    }
    if (this.cntA !== null && this.cntA !== undefined) {
      params.cntA = this.cntA;
    }
    if (this.cntB !== null && this.cntB !== undefined) {
      params.cntB = this.cntB;
    }
    if (this.isAdmin !== null && this.isAdmin !== undefined) {
      params.isAdmin = this.isAdmin;
    }
    if (this.sort) {
      params.sort = this.sort;
    }

    this.router.navigate([], {
      queryParams: params,
    });
  }

  trackById(index: number, item: User) {
    return item._id;
  }
}
