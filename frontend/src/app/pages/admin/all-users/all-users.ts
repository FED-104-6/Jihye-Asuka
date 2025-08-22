import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserService } from '../../../services/user.service';

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
  allUserDB: User[] = [];
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
  filteredItems: User[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.allUserDB = data.map((user) => ({
          ...user,
          birthdate: new Date(user.birthdate),
          age: getAge(new Date(user.birthdate)),
        }));
        this.filteredItems = [...this.allUserDB];
      },
      error: (err) => console.error(err),
    });

    this.route.queryParams.subscribe((params) => {
      this.type = params['type'] || [];
      this.ageA = params['ageA'] ? Number(params['ageA']) : null;
      this.ageB = params['ageB'] ? Number(params['ageB']) : null;
      this.cntA = params['cntA'] ? Number(params['cntA']) : null;
      this.cntB = params['cntB'] ? Number(params['cntB']) : null;
      this.isAdmin = params['isAdmin'] ? Boolean(params['isAdmin']) : null;
      this.sort = params['sort'] || '';
    });
  }

  getAllUsers() {
    return this.filteredItems;
  }

  openUserProfile(user: User) {
    this.isUserSelected = !this.isUserSelected;
    this.selectedUser = user;
  }
  removeUser(user: User) {
    if (!user._id) return;
    if (!confirm('Are you sure?')) return;

    this.userService.deleteUser(user._id).subscribe({
      next: (res) => {
        console.log(res.message);
        this.allUserDB = this.allUserDB.filter((u) => u._id !== user._id);
        this.filteredItems = this.filteredItems.filter(
          (u) => u._id !== user._id
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
        // 로컬 배열에서 바로 반영
        const index = this.allUserDB.findIndex(
          (u) => u._id === updatedUser._id
        );
        if (index !== -1) {
          this.allUserDB[index].admin = updatedUser.admin;
          this.filteredItems[index].admin = updatedUser.admin;
        }
        window.location.reload();
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
    if (value) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }
  filterReset() {
    this.type = [];
    this.sort = '';
    this.ageA = this.ageB = null;
    this.cntA = this.cntB = null;
    this.isAdmin = null;
    this.filteredItems = [...this.allUserDB];
    this.router.navigate([], { queryParams: {} });
  }
  filterApply(event: Event) {
    event.preventDefault();

    // // edit minus
    if (this.ageA !== null && this.ageA < 0) this.ageA = 0;
    if (this.ageB !== null && this.ageB < 0) this.ageB = 0;
    if (this.cntA !== null && this.cntA < 0) this.cntA = 0;
    if (this.cntB !== null && this.cntB < 0) this.cntB = 0;

    // filtering
    this.filteredItems = this.allUserDB.filter((user) => {
      const userAge = user.age ?? 0;
      const flatCnt = user.flats?.length ?? 0;

      const adminMatch = this.isAdmin === null || this.isAdmin == user.admin;
      const typeMatch =
        this.type.length === 0 || this.type.every((t) => user.type.includes(t));

      const ageMatch =
        (this.ageA === null || userAge >= this.ageA) &&
        (this.ageB === null || userAge <= this.ageB);
      const cntMatch =
        (this.cntA === null || flatCnt >= this.cntA) &&
        (this.cntB === null || flatCnt <= this.cntB);

      return adminMatch && typeMatch && ageMatch && cntMatch;
    });

    // sort
    const sortFuncs: Record<string, (a: User, b: User) => number> = {
      fAtoZ: (a, b) => a.firstname.localeCompare(b.firstname),
      fZtoA: (a, b) => b.firstname.localeCompare(a.firstname),
      lAtoZ: (a, b) => a.lastname.localeCompare(b.lastname),
      lZtoA: (a, b) => b.lastname.localeCompare(a.lastname),
      cntLH: (a, b) => (a.flats?.length ?? 0) - (b.flats?.length ?? 0),
      cntHL: (a, b) => (b.flats?.length ?? 0) - (a.flats?.length ?? 0),
    };

    if (sortFuncs[this.sort]) {
      this.filteredItems.sort(sortFuncs[this.sort]);
    }

    // url
    // const params: any = {
    //   type: this.type,
    //   amin: this.ageA,
    //   amax: this.ageB,
    //   cmin: this.cntA,
    //   cmax: this.cntB,
    //   isAdmin: this.isAdmin,
    //   sort: this.sort,
    // };
    // Object.keys(params).forEach(
    //   (key) => (params[key] == null || params[key] === '') && delete params[key]
    // );

    // this.router.navigate([], {
    //   queryParams: params,
    //   queryParamsHandling: 'merge',
    // });
  }
}
