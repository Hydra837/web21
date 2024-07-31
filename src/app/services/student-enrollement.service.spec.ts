import { TestBed } from '@angular/core/testing';

import { StudentEnrollmentService } from './student-enrollement.service';

describe('StudentEnrollementService', () => {
  let service: StudentEnrollmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentEnrollmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
