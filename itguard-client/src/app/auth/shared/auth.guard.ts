import { CanActivateFn } from "@angular/router";

export const privateGuard = (): CanActivateFn  => {
  return () =>{
    return true;
  }
};
export const publicGuard = (): CanActivateFn  => {
  return () =>{
    return true;
  }
};