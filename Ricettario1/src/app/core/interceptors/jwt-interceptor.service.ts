import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const JwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('access_token');  // ✅ Clave corregida
  
  if (token && !req.url.includes('/api/register/')) {
    const clonedReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next(clonedReq);
  }

  return next(req);
};
