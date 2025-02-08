import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../core/services/recipe.service';
import { Recipe } from '../core/interfaces/recipe';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-recipes',
  standalone: true,
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
  imports: [CommonModule, HttpClientModule],  // 🔹 IMPORTAR CommonModule
})
export class RecipesComponent implements OnInit {
  
  recipes: Recipe[] = [];  // Lista de recetas
  selectedRecipe: Recipe | null = null;  // Receta seleccionada para el modal
  showModal: boolean = false;  // Controla si se muestra el modal

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.getRecipes();
  }

  getRecipes(): void {
    this.recipeService.getPublicRecipes().subscribe(
      (data: Recipe[]) => {
        console.log('✅ Recetas obtenidas:', data);
        this.recipes = data;
      },
      (error) => {
        console.error('Error al obtener recetas', error);
      }
    );
  }

  // Muestra el modal con los detalles de la receta seleccionada
  showRecipeDetails(recipe: Recipe): void {
    this.selectedRecipe = recipe;
    this.showModal = true;
  }

  // Cierra el modal
  closeModal(): void {
    this.showModal = false;
    this.selectedRecipe = null;
  }
}
