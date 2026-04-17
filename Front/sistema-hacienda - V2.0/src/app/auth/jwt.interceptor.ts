import { jwtDecode } from 'jwt-decode';
import {catchError, Observable, throwError} from 'rxjs';
import { AuthserviceService } from '../services/authservice.service'; // FIX: Redirigido al servicio central
import { UserService } from '../services/user.service';
import {Router} from '@angular/router';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
/*export class JwtInterceptor implements HttpInterceptor {
  constructor(private auth: AuthserviceService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req);
  }
}*/


export class JwtInterceptor implements HttpInterceptor {

  private handling401 = false;

  constructor(
    private auth: AuthserviceService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.auth.getToken();

    const authReq = token
      ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401 && !this.handling401) {
          this.handling401 = true;

          this.auth.clearSession(); // SOLO limpiar storage
          this.router.navigateByUrl('/login');
        }

        return throwError(() => error);
      })
    );
  }
}


