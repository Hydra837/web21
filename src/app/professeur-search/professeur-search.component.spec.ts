import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesseurSearchComponent } from './professeur-search.component';

describe('ProfesseurSearchComponent', () => {
  let component: ProfesseurSearchComponent;
  let fixture: ComponentFixture<ProfesseurSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfesseurSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfesseurSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
