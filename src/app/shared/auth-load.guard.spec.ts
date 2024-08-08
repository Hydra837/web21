import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authLoadGuard } from './auth-load.guard';

describe('authLoadGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authLoadGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
