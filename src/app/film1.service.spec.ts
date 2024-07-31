import { TestBed } from '@angular/core/testing';

import { Film1Service } from './film1.service';

describe('Film1Service', () => {
  let service: Film1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Film1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
