import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFlats } from './my-flats';

describe('MyFlats', () => {
  let component: MyFlats;
  let fixture: ComponentFixture<MyFlats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFlats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyFlats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
