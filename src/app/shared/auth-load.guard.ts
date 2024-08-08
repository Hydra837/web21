import { CanActivateFn } from '@angular/router';

export const authLoadGuard: CanActivateFn = (route, state) => {
  return true;
};
