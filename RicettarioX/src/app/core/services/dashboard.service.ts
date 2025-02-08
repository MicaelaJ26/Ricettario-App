import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Recipe } from '../interfaces/recipe';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8000/api/recipes';

  constructor(private http: HttpClient) {}

  // Obtener todas las recetas del usuario
  getUserRecipes(): Observable<Recipe[]> {
    const token = localStorage.getItem('token');  // Obtiene el token del usuario
  
    if (!token) {
      console.error('Token no encontrado en localStorage');
      return throwError(() => new Error('No autorizado: Token faltante'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<Recipe[]>(`${this.apiUrl}/`, { headers });
  }
  
  // Crear una nueva receta
  addRecipe(recipeData: Recipe): Observable<Recipe> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Error: No hay token en localStorage.");
      return throwError(() => new Error('No autorizado: Token faltante'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Recipe>(`${this.apiUrl}/create/`, recipeData, { headers }); // Se mantiene `/create/`
  }

  // Eliminar una receta
  deleteRecipe(recipeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${recipeId}/`); // Se mantiene `/delete/`
  }

  // Editar una receta (no tienes un endpoint en Django, así que este método no funcionará sin modificar el backend)
  editRecipe(recipeId: number, updatedData: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`http://localhost:8000/api/recipes/update/${recipeId}/`, updatedData);
}


}
