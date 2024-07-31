import { TestBed } from '@angular/core/testing';

import { GradeServiceService } from './grade-service.service';

describe('GradeServiceService', () => {
  let service: GradeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
