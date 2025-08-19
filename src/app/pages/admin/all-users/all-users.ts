import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  // type: string; // 뭔데 이게
  // flatCnt: number; // falt 이랑 forign key
  // isAdmin: boolean; // db 컬럼에 추가하기
}
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
  allUserDB = [
    {
      id: 0,
      firstname: 'Jihye',
      lastname: 'Park',
      email: 'qkrwlgp1526@gmail.com',
      birthdate: new Date('2004-02-14'),
    },
    {
      id: 1,
      firstname: 'Jungkook',
      lastname: 'Jeon',
      email: 'hijklmnop@gmail.com',
      birthdate: new Date('1997-09-07'),
    },
    {
      id: 2,
      firstname: 'Doyoung',
      lastname: 'Kim',
      email: 'kiadoyoung@kia.com',
      birthdate: new Date('2003-10-02'),
    },
  ];

  isFilterOpen = false;

  // filter
  type: string = '';
  ageA: number | null = null;
  ageB: number | null = null;
  cntA: number | null = null;
  cntB: number | null = null;
  isAdmin: boolean | null = null;
  sort: string = '';
  filteredItems: User[] = this.allUserDB.map((user) => ({
    ...user,
    age: getAge(user.birthdate), // age 계산해서 추가
  }));

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.type = params['type'] || '';
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
  filterReset() {
    this.type = this.sort = '';
    this.ageA = this.ageB = null;
    this.cntA = this.cntB = null;
    this.isAdmin = null;
    this.filteredItems = [...this.allUserDB];
    this.router.navigate([], { queryParams: {} });
  }
  filterApply() {
    // edit minus
    if (this.ageA !== null && this.ageA < 0) this.ageA = 0;
    if (this.ageB !== null && this.ageB < 0) this.ageB = 0;
    if (this.cntA !== null && this.cntA < 0) this.cntA = 0;
    if (this.cntB !== null && this.cntB < 0) this.cntB = 0;

    // filtering
    // this.filteredItems = this.allUserDB.filter((user) => {
    //   const userAge = getAge(user.birthdate);
    //   const ageMatch =
    //     (this.ageA === null || userAge >= this.ageA) &&
    //     (this.ageB === null || userAge <= this.ageB);
    //   const cntMatch =
    //     (this.cntA === null || user.size >= this.cntA) &&
    //     (this.cntB === null || user.size <= this.cntB);

    //   return cityMatch && priceMatch && sizeMatch;
    // });

    // sort
    // const sortFuncs: Record<string, (a: Item, b: Item) => number> = {
    //   aToZ: (a, b) => a.city.localeCompare(b.city),
    //   zToA: (a, b) => b.city.localeCompare(a.city),
    //   priceLH: (a, b) => a.price - b.price,
    //   priceHL: (a, b) => b.price - a.price,
    //   sizeLH: (a, b) => a.size - b.size,
    //   sizeHL: (a, b) => b.size - a.size,
    // };

    // if (sortFuncs[this.sort]) {
    //   this.filteredItems.sort(sortFuncs[this.sort]);
    // }

    // // url
    // const params: any = {
    //   city: this.city,
    //   pmin: this.priceA,
    //   pmax: this.priceB,
    //   smin: this.sizeA,
    //   smax: this.sizeB,
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
