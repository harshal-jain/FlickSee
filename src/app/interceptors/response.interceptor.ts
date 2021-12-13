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

      // jab request ko handle kr lega. humare paas response aaega. response observable format me aaega. 
      // toh hame ab ispe multiple operation perform krne hai toh humne ispe pipe lga diya. pipe me hum 
      // multiple rxjs ke operator ko apply kr sakte hai
    return next.handle(req).pipe(
      retry(3), // jab bhi request krte hai, uss moment pe server - (shut down, or server down) ays ahota hai toh toh rxjs apne yeh retry ki facility provide krta hai.
      map(res => { // agar ok hai toh yha aaega
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
