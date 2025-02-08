import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule]
})
export class NavbarComponent implements OnInit {
  isAuthenticated$!: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {} 

  ngOnInit() {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  navigateToMyRecipes() {
    this.router.navigate(['/myrecipes']); 
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']); 
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToRecipes() {
    this.router.navigate(['/recipes']);
  }

  navigateToMixitup() {
    this.router.navigate(['/mix-it-up']);
  }
}
