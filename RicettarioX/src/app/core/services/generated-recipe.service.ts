import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneratedRecipe } from '../interfaces/generated-recipe';

@Injectable({
  providedIn: 'root',
})
export class GeneratedRecipeService {
  
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getGeneratedRecipes(): Observable<GeneratedRecipe[]> {
    return this.http.get<GeneratedRecipe[]>(`${this.apiUrl}/generated-recipes/`);
  }

  mixItUp(): Observable<GeneratedRecipe> {
    return this.http.post<GeneratedRecipe>(`${this.apiUrl}/mix-it-up/`, {});
  }
  deleteRecipe(recipeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${recipeId}/`);
  }
}
