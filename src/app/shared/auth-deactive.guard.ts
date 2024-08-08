import { CanActivateFn } from '@angular/router';

export const authDeactiveGuard: CanActivateFn = (route, state) => {
  return true;
};
