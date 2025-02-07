import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../interfaces/recipe';
import { catchError, tap } from 'rxjs/operators';  
import { throwError } from 'rxjs';  


@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'http://127.0.0.1:8000/api/recipes/';

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  createRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}create/`, recipe).pipe(
      tap(response => {
        console.log('Respuesta del backend al crear receta:', response);
      }),
      catchError(error => {
        console.error('Error al crear receta:', error);
        return throwError(error);
      })
    );
  }

 editRecipe(recipeId: number, updatedData: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`http://localhost:8000/api/recipes/update/${recipeId}/`, updatedData);
}

  deleteRecipe(recipeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delete/${recipeId}/`);
  }

  getPublicRecipes(): Observable<Recipe[]> {
  return this.http.get<Recipe[]>(`http://127.0.0.1:8000/api/recipes/public/`, {
    headers: {
      'Content-Type': 'application/json'
    }  
  });
}
}
