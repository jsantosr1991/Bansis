import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {provideRouter, withHashLocation} from '@angular/router';
import { routes } from './app/app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient,  withInterceptorsFromDi} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { importProvidersFrom } from '@angular/core';
import {JwtInterceptor} from './app/auth/jwt.interceptor';




bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    importProvidersFrom(FormsModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    }
    ]
});
