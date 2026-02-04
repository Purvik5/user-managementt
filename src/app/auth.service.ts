import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'isLoggedIn';
  private readonly fakeEmail = 'admin@mail.com';
  private readonly fakePassword = '123456';

  login(email: string, password: string): boolean {
    if (email === this.fakeEmail && password === this.fakePassword) {
      localStorage.setItem(this.storageKey, 'true');
      return true;
    }

    return false;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.storageKey) === 'true';
  }
}
