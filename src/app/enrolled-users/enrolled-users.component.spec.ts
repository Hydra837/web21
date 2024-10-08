import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledUsersComponent } from './enrolled-users.component';

describe('EnrolledUsersComponent', () => {
  let component: EnrolledUsersComponent;
  let fixture: ComponentFixture<EnrolledUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnrolledUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrolledUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
