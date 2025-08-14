import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFlat } from './edit-flat';

describe('EditFlat', () => {
  let component: EditFlat;
  let fixture: ComponentFixture<EditFlat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFlat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFlat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
