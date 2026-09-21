import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import {
  inject
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  catchError,
  throwError
} from 'rxjs';


export const authInterceptor:
  HttpInterceptorFn = (
    req,
    next
  ) => {

    const router =
      inject(Router);

    const token =
      localStorage.getItem(
        'token'
      );

    const requestAutenticada =
      token
        ? req.clone({
            setHeaders: {
              Authorization:
                `Bearer ${token}`
            }
          })
        : req;

    return next(
      requestAutenticada
    )
    .pipe(

      catchError(
        (
          error:
            HttpErrorResponse
        ) => {
          if (error.status === 401) {

            localStorage.removeItem(
              'token'
            );

            localStorage.removeItem(
              'usuario'
            );

            localStorage.removeItem(
              'rol'
            );

            localStorage.removeItem(
              'usuarioId'
            );

            void router.navigate(
              ['/login'],
              {
                queryParams: {
                  sesionExpirada: true
                }
              }
            );
          }

          return throwError(
            () => error
          );
        }
      )

    );
  };