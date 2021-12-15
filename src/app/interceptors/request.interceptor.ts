import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../components/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RequestInterceptors implements HttpInterceptor {

  constructor(private _authService: AuthService) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    let request: any;
    let currentUser: any;
    let isLoggedIn: boolean;

    // token hame login krne ke baad need hoti hai toh
    this._authService.IsLoggedIn.subscribe(res => {

      isLoggedIn = res;

      if (isLoggedIn) {

        this._authService.currentUser.subscribe(res => {

          currentUser = res; // res me saari details aa jaaegi uske saath ek token bhi hoga

          if (req.headers.has('isfile')) { // yeh isfile data.service me postImage se aaya hai // isse yeh pta lag rha hai ki kya headersme yeh - isFile kacolumn exist krta hai kya 
            request = req.clone({ headers: req.headers.delete('isfile') }); // isko hume api pe toh bhejna nhi hai toh hum isfile flag ko delete bhi kr denge
            // For image
            request = req.clone({
              setHeaders: {

                'Authorization': `Bearer ${currentUser.token}`
              }
            });

          }

          else {


            // For Normal Data : 
            request = req.clone({
              setHeaders: {
                'Content-Type': 'application/json', // isse hum bta rhe hai ki hum data JSON format me bhej rhe hai
                'Authorization': `Bearer ${currentUser.token}`
              }
            });

          }




        })


      }
      else {

        // yha pe token pass krne ki need nhi hai. isliye
        request = req.clone({ // yeh humne copy bana li
          setHeaders: {
            'Content-Type': 'application/json'
          }
        });

      }

    })

    // request me sab modify hoke aa gya. ab isko return kr denge
    return next.handle(request);

  }




}
