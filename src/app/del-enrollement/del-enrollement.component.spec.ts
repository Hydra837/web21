import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelEnrollementComponent } from './del-enrollement.component';

describe('DelEnrollementComponent', () => {
  let component: DelEnrollementComponent;
  let fixture: ComponentFixture<DelEnrollementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DelEnrollementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelEnrollementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
