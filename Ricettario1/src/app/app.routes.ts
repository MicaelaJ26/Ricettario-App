import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

import { RecipesComponent } from './recipes/recipes.component';
import { RegisterComponent } from './register/register.component';
import { MixItUpComponent } from './mix-it-up/mix-it-up.component';
import { MyrecipesComponent } from './myrecipes/myrecipes.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  
  { path: 'home', component: HomeComponent },  
  { path: 'login', component: LoginComponent },
  { path: 'myrecipes', component: MyrecipesComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mix-it-up', component: MixItUpComponent }
];

