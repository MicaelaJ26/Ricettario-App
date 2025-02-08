import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/login/';
  private jwtHelper = new JwtHelperService();

  // BehaviorSubject para actualizar el estado de autenticación en tiempo real
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap((response) => {
        if (response.access) {
          localStorage.setItem('access_token', response.access);  // ✅ Unificar clave "access_token"
          localStorage.setItem('refresh_token', response.refresh);
          this.isAuthenticatedSubject.next(true);  // ✅ Notificar autenticación exitosa
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isAuthenticatedSubject.next(false);  // ✅ Notificar cierre de sesión
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Asumiendo que guardas el token en localStorage
  }
  
  getToken(): string | null {
    return localStorage.getItem('access_token');  // ✅ Clave corregida
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private checkToken(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }


}
