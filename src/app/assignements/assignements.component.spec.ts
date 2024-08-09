import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignementsComponent } from './assignements.component';

describe('AssignementsComponent', () => {
  let component: AssignementsComponent;
  let fixture: ComponentFixture<AssignementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
