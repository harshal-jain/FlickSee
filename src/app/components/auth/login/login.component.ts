import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { Global } from 'src/app/shared/services/global';
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
  @ViewChild('nav') elnav : any;

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
      email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
      userTypeId: [1],
      password: ['', Validators.compose([Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}")])],
      confirmPassword: ['', Validators.required]
    });
  }

  get rfControls()
  {
    return this.registerForm.controls;
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


  register(formData: any) {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this._dataService.post(Global.BASE_API_PATH + "UserMaster/Save", formData.value).subscribe(res => {
      if (res.isSuccess) {
        this._toastr.success("Registration has been successfully done !!", "Register");

        this.registerForm.reset({
          firstName: "",
          lastName: "",
          email: "",
          userTypeId: 1,
          password: "",
          confirmPassword: ""
        });
        this.submitted = false;
        this.elnav.select('logintab');
      }
      else {
        this._toastr.error(res.error[0], "Register");
      }
    });
  }

  // UserMaster/Login

}
