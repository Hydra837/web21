import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authDeactiveGuard } from './auth-deactive.guard';

describe('authDeactiveGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authDeactiveGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
