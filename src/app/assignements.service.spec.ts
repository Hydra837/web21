import { TestBed } from '@angular/core/testing';

import { AssignementsService } from './assignements.service';

describe('AssignementsService', () => {
  let service: AssignementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
