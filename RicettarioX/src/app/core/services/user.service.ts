import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://127.0.0.1:8000/api/register/'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  // ✅ Método para iniciar sesión y guardar el token
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, credentials);
  }

  // ✅ Guardar el token en localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // ✅ Obtener el token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Eliminar el token (Cerrar sesión)
  logout(): void {
    localStorage.removeItem('token');
  }

  // ✅ Método para registrar un usuario
  // registerUser(user: User): Observable<User> {
  //   return this.http.post<User>(`${this.apiUrl}`, user);
  // }
  registerUser(user: User) {
    return this.http.post('http://127.0.0.1:8000/api/register/', user);  // 🚀 Sin autenticación
  }
  

  // ✅ Obtener los headers con el token
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  // ✅ Obtener usuario por ID (requiere autenticación)
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() });
  }

  // ✅ Actualizar usuario (requiere autenticación)
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}${id}/`, user, { headers: this.getAuthHeaders() });
  }

  // ✅ Eliminar usuario (requiere autenticación)
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`, { headers: this.getAuthHeaders() });
  }
}
