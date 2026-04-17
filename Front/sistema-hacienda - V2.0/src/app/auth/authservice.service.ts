import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../services/user.service'; // FIX: Redirigido al servicio central


interface JwtPayload {
  username: string;
  rol_id: number;
  group_id: number;
  codempleado: string;
  empe_nom: string;
  empresa_id: number;
}


interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}


@Injectable({
  providedIn: 'root'
})


export class AuthserviceService {

  private baseUrl = environment.apiUrl;

  private tokenKey = 'access_token';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  
  constructor(private http: HttpClient, private userService: UserService) {
    console.warn('ALERTA: Se está instanciando el AuthserviceService obsoleto en src/app/auth/authservice.service.ts');
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        this.userService.setUser({
          username: decoded.username,
          rol_id: decoded.rol_id,
          group_id: decoded.group_id,
          codempleado: decoded.codempleado,
          empe_nom: decoded.empe_nom,
          empresa_id: decoded.empresa_id
        })


      } catch (e) {
        console.error('Error al decodificar token en constructor', e);
        this.userService.clearUser();
      }
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.access_token);
          this.loggedIn.next(true);

          const decoded = jwtDecode<JwtPayload>(response.access_token);

          this.userService.setUser({
            username: decoded.username,
            rol_id: decoded.rol_id,
            group_id: decoded.group_id,
            codempleado: decoded.codempleado,
            empe_nom: decoded.empe_nom,
            empresa_id: decoded.empresa_id
          });
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
    this.userService.clearUser(); // << importante
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getToken(): string | null {

        return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }


  clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }





}
