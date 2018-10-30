import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthenticationService) {}

  canActivate(): boolean {
    if(this.auth.isAuthenticated() === 1) return true;
  }  
}
