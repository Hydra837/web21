import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEnrollementComponent } from './manage-enrollement.component';

describe('ManageEnrollementComponent', () => {
  let component: ManageEnrollementComponent;
  let fixture: ComponentFixture<ManageEnrollementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageEnrollementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEnrollementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
