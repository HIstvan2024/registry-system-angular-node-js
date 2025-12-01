import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environment/environment';

interface LoginResp { token: string; username: string; role: string; }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'jwt_token';
  private userSub = new BehaviorSubject<string | null>(localStorage.getItem(this.tokenKey));
  user$ = this.userSub.asObservable();

  constructor(private http: HttpClient) {}

  // Figyelj: a backend username/password kulcsokat vár!
  login(felhasznalo: string, jelszo: string) {
    return this.http.post<LoginResp>(`${environment.apiUrl}/auth/login`, { username: felhasznalo, password: jelszo })
      .pipe(tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        this.userSub.next(res.token);
      }));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.userSub.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
