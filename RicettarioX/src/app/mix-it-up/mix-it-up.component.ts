import { Component, OnInit } from '@angular/core';
import { GeneratedRecipeService } from '../core/services/generated-recipe.service';
import { GeneratedRecipe } from '../core/interfaces/generated-recipe';
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mix-it-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mix-it-up.component.html',
  styleUrl: './mix-it-up.component.css'
})

export class MixItUpComponent implements OnInit {
  generatedRecipes: GeneratedRecipe[] = []; // Almacenar todas las recetas generadas
  loading: boolean = false;
  errorMessage: string = '';
  isAuthenticated: boolean = false;
 

  constructor(
    private generatedRecipeService: GeneratedRecipeService,
    private authService: AuthService  
  ) {}
  
  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.getGeneratedRecipes();
  }
  
  // Obtener todas las recetas generadas
  getGeneratedRecipes(): void {
    this.generatedRecipeService.getGeneratedRecipes().subscribe(
      (recipes) => {
        this.generatedRecipes = recipes; // Guardamos todas las recetas generadas
      },
      (error) => {
        console.error('Error al obtener recetas generadas', error);
        this.errorMessage = 'No se pudieron cargar las recetas generadas.';
      }
    );
  }

  // Generar una nueva receta Mix It Up
  generateRecipe(): void {
    this.loading = true;
    this.errorMessage = '';

    this.generatedRecipeService.mixItUp().subscribe(
      (recipe) => {
        this.generatedRecipes.push(recipe); // Agregamos la nueva receta a la lista
        this.loading = false;
      },
      (error) => {
        console.error('Error al generar la receta', error);
        this.errorMessage = 'No se pudo generar la receta.';
        this.loading = false;
      }
    );
  }

  // Eliminar una receta generada
  deleteRecipe(recipeId: number): void {
    this.generatedRecipeService.deleteRecipe(recipeId).subscribe({
      next: () => {
        // Eliminar la receta de la lista después de borrarla en la API
        this.generatedRecipes = this.generatedRecipes.filter(recipe => recipe.id !== recipeId);
      },
      error: (error) => {
        console.error('Error al eliminar la receta', error);
        this.errorMessage = 'No se pudo eliminar la receta.';
      }
    });
  }
 
}
