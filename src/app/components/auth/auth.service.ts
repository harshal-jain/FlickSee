import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private message: string = "";
  private currentUserSubject = new BehaviorSubject<any>(null); // For Token Use
  private loggedIn = new BehaviorSubject<boolean>(false); // by default logged user nhi hai isliye false daal diya


  get currentUser() {
    return this.currentUserSubject.asObservable();
  }

  get IsLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router) { }

  login(objUserDetails: any) {
    if (objUserDetails.id === 0) {
      this.message = "Please enter valid username and password !!";
      this.currentUserSubject.next(null); // current user koi bhi nhi aaya isliye null daal denge
      this.loggedIn.next(false); // login nhi krana hai islye false daal denge
      localStorage.clear();
    }
    else {
      this.message = "";
      localStorage.setItem("userDetails", JSON.stringify(objUserDetails));
      this.currentUserSubject.next(objUserDetails); //  current user ko daal denge
      this.loggedIn.next(true); // login ho gya hai isliye true daal denge
      this.router.navigate(['dashboard/default']);

    }
  }

  getMessage(): string {
    return this.message;
  }

  logout() {
    localStorage.clear();
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['auth/login']);
  }
}
