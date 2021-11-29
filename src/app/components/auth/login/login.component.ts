import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { Global } from 'src/app/shared/services/global';
import { runInThisContext } from 'vm';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  submitted: boolean = false;
  strMsg: string = "";

  constructor(private _authService: AuthService, private _fb: FormBuilder, private _toastr: ToastrService, private _dataService: DataService) { }

  ngOnInit(): void {
    this.setLoginForm();
    this.setRegisterForm();
  }

  setLoginForm() {
    this.loginForm = this._fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],

    });
  }

  setRegisterForm() {
    this.registerForm = this._fb.group({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern("")])],
      userTypeId: [1],
      password: ['', Validators.compose([Validators.required, Validators.pattern("")])],
      confirmPassword: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.get('userName').value == "") {
      this._toastr.error("User Name is required !!", "Login");
    }
    else if (this.loginForm.get('password').value == "") {
      this._toastr.error("Password is required !!", "Login");

    }
    else {
      if (this.loginForm.valid) {
        this._dataService.post(Global.BASE_API_PATH + "UserMaster/Login/", this.loginForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._authService.login(res.data);
            this.strMsg = this._authService.getMessage();
            if (this.strMsg !== "") {
              this._toastr.error(this.strMsg, "Login");
              this.loginForm.reset();
            }

          }
          else {
            this._toastr.error(res.errors[0], "Login");
          }
        })
      }
      else {
        this._toastr.error("Invalid Credentials !!", "Login");
      }
    }
  }

  // UserMaster/Login

}
