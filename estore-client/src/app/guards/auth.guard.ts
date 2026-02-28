import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../components/home/user/services/user';

export const authGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isUserAuthenticated) {
    return true;
  }

  router.navigate(['home/login']);
  return false;
};
