import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarProfesseurComponent } from './navbar-professeur.component';

describe('NavbarProfesseurComponent', () => {
  let component: NavbarProfesseurComponent;
  let fixture: ComponentFixture<NavbarProfesseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarProfesseurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarProfesseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
