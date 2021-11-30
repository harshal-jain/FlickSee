import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';
import { AuthService } from '../components/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ResponseInterceptors implements HttpInterceptor {

  constructor(private _authService: AuthService) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    
    return next.handle(req).pipe(
      retry(3),
      map(res => {
        debugger;
        if (res instanceof HttpResponse) {
          return res; //agar error nhi hai toh res return krde
        }
        return null;
      }),
      catchError((err: HttpErrorResponse) => {
        debugger;
        let errMsg = "";

        //Client Side Ereror
        if (err.error instanceof ErrorEvent) {
          errMsg = `Error : ${err.message}`;
        } else {
          // Server -Side Error
          errMsg = `Message : ${err.message} Error Code : ${err.status}`
        }
        return throwError(errMsg);

      })
    )

  }


}
