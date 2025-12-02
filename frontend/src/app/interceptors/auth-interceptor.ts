import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptorFn,
  HttpHandlerFn
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    if (token) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }
  return next(req);
};
