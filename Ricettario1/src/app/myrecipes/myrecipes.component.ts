import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../core/services/dashboard.service'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';  
import { Observable,throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recipe } from '../core/interfaces/recipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myrecipes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './myrecipes.component.html',
  styleUrl: './myrecipes.component.css'
})

export class MyrecipesComponent implements OnInit {
  recipes: Recipe[] = [];  
  recipe: Recipe = {} as Recipe;  
  modalRecipe: any = null; 
  showModal: boolean = false; 
  currentSection: string = 'my-recipes'; 
  apiUrl = 'http://127.0.0.1:8000/api/recipes/';  


  constructor(
    private dashboardService: DashboardService,
    private http: HttpClient,
    private router: Router
  ) {}
  

  ngOnInit(): void {
    this.getRecipes();
  }

  // Obtener recetas del usuario con autenticación
getUserRecipes(): Observable<Recipe[]> {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No hay token en localStorage');
    alert('Necesitas iniciar sesión para ver las recetas.');
    return new Observable<Recipe[]>(); 
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<Recipe[]>(this.apiUrl, { headers });
}

// Obtener recetas y actualizarlas en la vista
getRecipes(): void {
  this.getUserRecipes().subscribe(
    (data: Recipe[]) => {
      console.log('✅ Recetas obtenidas:', data);
      this.recipes = data.map(recipe => ({
        ...recipe,
        image_url: recipe.image_url ? `http://localhost:8000${recipe.image_url}` : null
      }));
    },
    (error) => {
      console.error('Error al obtener recetas', error);
    }
  );
}
  // Mostrar la sección activa según lo que el usuario seleccione
  showSection(section: string): void {
    this.currentSection = section;
  }

  // Crear y editar una receta 
  submitRecipe(): void {
    if (!this.recipe.title || !this.recipe.ingredients || !this.recipe.description) {
      alert('Por favor completa todos los campos antes de agregar la receta.');
      return;
    }
  
    if (this.recipe.id) {
      // Editar receta
      // this.dashboardService.editRecipe(this.recipe.id, this.recipe).subscribe(
      //   () => {
      //     alert('Receta editada correctamente.');
      //     this.getRecipes(); 
      //     this.showSection('my-recipes');
      //     this.recipe = {} as Recipe; 
      //   },
      //   (error) => {
      //     console.error('Error al editar la receta', error);
      //     alert('Error al editar la receta. Revisa la consola.');
      //   }
      // );
    } else {
      // Crear nueva receta
      this.dashboardService.addRecipe(this.recipe).subscribe(
        (newRecipe) => {
          alert('Receta agregada correctamente.');
          this.recipes.push(newRecipe); 
          this.showSection('my-recipes');
          this.recipe = {} as Recipe;
        },
        (error) => {
          console.error('Error al agregar la receta', error);
          alert('Error al agregar la receta. Revisa la consola.');
        }
      );
    }
  }
  // Eliminar una receta
  deleteRecipe(id: number): void {
    if (!confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      return; // Si el usuario cancela, no hacemos nada
    }
  
    this.dashboardService.deleteRecipe(id).subscribe(
      () => {
        alert('Receta eliminada correctamente.');
        this.getRecipes();  
      },
      (error) => {
        console.error('Error al eliminar la receta', error);
        alert('Error al eliminar la receta. Revisa la consola.');
      }
    );
  }
  // Cargar una receta para editarla
  // editRecipe(recipe: Recipe): void {
  //   this.recipe = { ...recipe };  
  //   this.showSection('add-edit-delete-recipes'); 
  // }

  // Mostrar los detalles de una receta en el modal
  viewDetails(recipe: Recipe): void {
    this.modalRecipe = recipe;
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
    this.modalRecipe = null;
  }
  
  // Manejar la selección de archivo (por ejemplo, imagen)
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log(file);  
  }
}
scrollToSection(sectionId: string): void {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}
navigateToRecipes() {
  this.router.navigate(['/recipes']);
}

}