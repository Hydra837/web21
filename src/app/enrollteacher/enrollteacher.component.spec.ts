import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollteacherComponent } from './enrollteacher.component';

describe('EnrollteacherComponent', () => {
  let component: EnrollteacherComponent;
  let fixture: ComponentFixture<EnrollteacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnrollteacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollteacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
