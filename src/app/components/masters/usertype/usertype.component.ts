import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { DBOperation } from 'src/app/shared/services/db-operation';
import { Global } from 'src/app/shared/services/global';
import { CharFieldValidator, NoWhiteSpaceValidator } from 'src/app/validations/validations.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usertype',
  templateUrl: './usertype.component.html',
  styleUrls: ['./usertype.component.scss']
})
export class UsertypeComponent implements OnInit, OnDestroy {

  objRows: any[];
  addForm: FormGroup;
  buttonText: string;
  objRow: any;
  dbops: DBOperation;
  @ViewChild('nav') elnav: any;

  formErrors = {
    name: ''
  }

  validationMessages = {
    name: {
      required: "Name is required",
      minlength: "Name cannot be less than 1 char long",
      maxlength: "Name cannot be more than 10 char long",
      noWhiteSpaceValidator: "Only white space is not allowed",
      validCharField: "Name must contains char and space only"

    }
  };

  onValueChanged() {
    if (!this.addForm) {
      return;
    }

    for (const field of Object.keys(this.formErrors)) // object key is -> name //hame loop chalan hoga object ki keys par
    {
      this.formErrors[field] = "";  // name me agar koi error set hoga toh empty kr denge
      const control = this.addForm.get(field); //control me 'name' aa jaaega

      if (control && control.dirty && control.invalid) {
        const message = this.validationMessages[field]; // name ke andar jitne bhi validation msg hai voh aa jaaenge
        for (const key of Object.keys(control.errors)) { // joh bhi error hoga 'name' control pe usko get kr lega

          if (key !== 'required') {
            this.formErrors[field] += message[key] + ' '; // key ka message ko formerrors me add kr dega. starting me formerrors me empty msg hai.
          }
        }
      }
    }

  }

  get afControls() {
    return this.addForm.controls;
  }

  constructor(private _dataService: DataService, private _toaster: ToastrService, private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.getData();
    this.setFormState();
  }

  setFormState() {
    this.buttonText = "Submit";
    this.dbops = DBOperation.create;
    this.addForm = this._fb.group({
      id: [0],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NoWhiteSpaceValidator.noWhiteSpaceValidator,
        CharFieldValidator.validCharField,
      ])]
    })

    this.addForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    })
  }



  getData() {
    this._dataService.get(Global.BASE_API_PATH + "Usertype/GetAll").subscribe(res => {
      if (res.isSuccess) {
        debugger;
        this.objRows = res.data;

      }
      else {
        this._toaster.error("res.errors[0]", "User Type");
      }
    })
  }

  Submit() {

    switch (this.dbops) {
      case DBOperation.create:
        this._dataService.post(Global.BASE_API_PATH + "Usertype/Save/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._toaster.success("Record has been saved successfully", "User Type");
            this.resetForm();
          }
          else {
            this._toaster.error(res.errors[0], "User Type");

          }
        })
        break;

      case DBOperation.update:

        this._dataService.post(Global.BASE_API_PATH + "Usertype/Update/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._toaster.success("Record has been updated successfully", "User Type");
            this.resetForm();

          }
          else {
            this._toaster.error(res.errors[0], "User Type");

          }
        })

        break;
    }
  }

  resetForm() {
    this.addForm.reset({
      id: 0,
      name: ""
    });
    this.buttonText = "Submit";
    this.dbops = DBOperation.create;
    this.elnav.select('viewtab');
    this.getData();
  }

  cancelForm() {
    this.addForm.reset({
      id: 0,
      name: ""
    });
    this.buttonText = "Submit";
    this.dbops = DBOperation.create;
    this.elnav.select('viewtab');
  }

  Edit(_id: number) {
    this.buttonText = "Update";
    this.dbops = DBOperation.update;
    this.elnav.select('addtab');
    this.objRow = this.objRows.find(x => x.id === _id);
    this.addForm.controls['id'].setValue(this.objRow.id);
    this.addForm.controls['name'].setValue(this.objRow.name);


  }

  Delete(_id: number) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!'
      ,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {

        let obj = {
          id: _id
        }
        this._dataService.post(Global.BASE_API_PATH + "Usertype/Delete", obj).subscribe(res => {
          if (res.isSuccess) {

            Swal.fire(
              'Deleted!',
              'Your Record has been deleted.',
              'success'
            )
            this.getData();
          }
          else {
            this._toaster.error(res.errors[0], "User Type");

          }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your record is safe :)',
          'error'
        )
      }
    })




  }

  tabChange(event: any) {
    if (event.nextId == "addtab") {
      this.addForm.reset({
        id: 0,
        name: ""
      });
      this.buttonText = "Submit";
      this.dbops = DBOperation.create;
    }
  }

  ngOnDestroy() {
    this.objRows = [];
    this.objRow = null;
  }

}
