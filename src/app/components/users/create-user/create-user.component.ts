import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { DBOperation } from 'src/app/shared/services/db-operation';
import { Global } from 'src/app/shared/services/global';
import { MustMatchValidator } from 'src/app/validations/validations.validator';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  userId: number = 0; // joh user id list-user se aaari hai edit pe click krne pe usko hum isme receive krenge
  addForm: FormGroup;
  submitted: boolean = false;
  dbops: DBOperation; // kabhi submit krna hai khabhi update kra hai
  buttenText: string; // kabhi submit krna hai khabhi update kra hai
  objUserTypes: []; // api se data consume krke isme rakhenge

  // Activated route isliye liya hai kyuki hume hume userId joh list-user peedit pe click ckre aari hai usko hum isme le lenge
  constructor(private route: ActivatedRoute, private _fb: FormBuilder, private _toastr: ToastrService, private _dataService: DataService) {

    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'] // same name jis name se bheje hai
    })
  }

  ngOnInit(): void {
    this.setFormState();
    this.getUserTypes();

    // yeh jab hum list-user pe edit pe clikc krenge toh create-user pe data show hona cheye uske liye
    if (this.userId && this.userId != null && this.userId > 0) {
      this.getUserById();
      this.buttenText = "Update";
      this.dbops = DBOperation.update;
    }
  }

  setFormState() {
    this.buttenText = "Submit";
    this.dbops = DBOperation.create;
    this.addForm = this._fb.group({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
      userTypeId: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}")])],
      confirmPassword: ['', Validators.required]
    },
      {
        validators: MustMatchValidator('password', 'confirmPassword')
      }
    );
  }

  get rfControls() {
    return this.addForm.controls;
  }

  // yha pe saare user types aa jaaenge - jyse ki admin, customer aur joh bhi hai
  getUserTypes() {
    this._dataService.get(Global.BASE_API_PATH + "UserType/GetAll").subscribe(res => {
      if (res.isSuccess) {

        this.objUserTypes = res.data;
        debugger;
      }
      else {
        this._toastr.error("res.errors[0]", "User Master");
      }
    })
  }

  // jab hum list-user pe uster type ke edit pe click krenge toh konsa user hai uski id aa jaaegi
  getUserById() {
    this._dataService.get(Global.BASE_API_PATH + "UserMaster/GetbyId/" + this.userId).subscribe(res => {
      if (res.isSuccess) {
        this.addForm.patchValue(res.data); // res.data me joh joh data aaya hua hoga voh addForm me fill kr dega
      }
      else {
        this._toastr.error("res.errors[0]", "User Master");
      }
    })
  }

  register(formData: any) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }

    switch (this.dbops) {
      case DBOperation.create:

        this._dataService.post(Global.BASE_API_PATH + "UserMaster/Save", formData.value).subscribe(res => {
          if (res.isSuccess) {
            if (res.data == -1) { // -1 custom api se aara hai
              this._toastr.error("Email id already exists !!", "Add User")
            } else if (res.data == -2) { // -2 custom api se aara hai
              this._toastr.error("User does not exists !!", "Add User")
            }
            else {
              this._toastr.success("User has been added successfully !!", "Add User");

              this.addForm.reset();
              this.submitted = false;
            }

          }
          else {
            this._toastr.error(res.error[0], "Add User");
          }
        });
        break;

      case DBOperation.update:

        this._dataService.post(Global.BASE_API_PATH + "UserMaster/Update", formData.value).subscribe(res => {
          if (res.isSuccess) {

            if (res.data == -1) {
              this._toastr.error("Email id already exits !!", "Add User")
            }
            else if (res.data == -2) {
              this._toastr.error("User does not exists !!", "Add User")
            }
            else {
              this._toastr.success("User has been updated successfully !!", "Add User");

              this.addForm.reset();
              this.submitted = false;
            }
          }
          else {
            this._toastr.error(res.error[0], "Add User");
          }
        });
    }
  }

  // UserMaster/Login

}
