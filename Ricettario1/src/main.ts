import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';   
import { routes } from './app/app.routes';
import { JwtInterceptor } from './app/core/interceptors/jwt-interceptor.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  // Configuración de rutas
    provideHttpClient(withInterceptors([JwtInterceptor])) // HTTP + Interceptor JWT
  ]
}).catch(err => console.error(err));
