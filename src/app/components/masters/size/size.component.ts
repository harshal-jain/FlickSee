import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { DBOperation } from 'src/app/shared/services/db-operation';
import { Global } from 'src/app/shared/services/global';
import { CharFieldValidator, NoWhiteSpaceValidator } from 'src/app/validations/validations.validator';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss']
})
export class SizeComponent implements OnInit, OnDestroy {

  objRows: any[]; 
  addForm: FormGroup;
  buttonText: string; // yeh isliye hai ki 'Add' ke time 'Submit' show ho and 'Edit' ke time 'Update' show ho
  objRow: any;
  dbops: DBOperation; // For Enum
  @ViewChild('nav') elnav: any; // tab ko select / unselect krna hai

  // joh bhi run time pe error aaega usko hum yha pe laake add krenge. isko hum html pe bind krenge jyse formErrors.name
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

      //agar control undefined nhi hai & control.dirty matalab value change kr diya & control invalid hai
      if (control && control.dirty && control.invalid) { // control.invalid matalab matalab jab ek bhi validation full fil nhi hoga toh is loop me jaaega
        const message = this.validationMessages[field]; // name ke andar jitne bhi validation msg hai voh aa jaaenge
        for (const key of Object.keys(control.errors)) { // joh bhi error hoga 'name' control pe usko get kr lega

          // value changes jab e call hota hai jab kuch bhi change krte hai. toh required vaala toh hame daalna e pdega html pe
          if (key !== 'required') {
            this.formErrors[field] += message[key] + ' '; // key ka message ko formerrors me add kr dega. starting me formerrors me empty msg hai.
          }
        }
      }
    }

  }

  

  constructor(private _dataService: DataService, private _toaster: ToastrService, private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.getData();
    this.setFormState();
  }

  // yeh voh method hai joh sabse phele initialize hoga 
  setFormState() {
    this.buttonText = "Submit"; // sabse phele add ka e operation hoga
    this.dbops = DBOperation.create; // create isliye kiya kyuki creation phase me hai
    this.addForm = this._fb.group({
      id: [0],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NoWhiteSpaceValidator.noWhiteSpaceValidator, // no white space
        CharFieldValidator.validCharField, // Allow char and space only
      ])]
    })

    // yeh humne dynamic error show krne ke liye lgaya hai
    this.addForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    })
  }

  get afControls() {
    return this.addForm.controls;
  }

// api se data laa rhe hai
  getData() {
    this._dataService.get(Global.BASE_API_PATH + "SizeMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        //debugger;
        this.objRows = res.data;

      }
      else {
        this._toaster.error("res.errors[0]", "Size Master");
      }
    })
  }

  
  Submit() {

    switch (this.dbops) {

      // Agar Add krna hai toh ispe
      case DBOperation.create:
        this._dataService.post(Global.BASE_API_PATH + "SizeMaster/Save/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._toaster.success("Record has been saved successfully", "Size Master");
            this.resetForm();
          }
          else {
            this._toaster.error(res.errors[0], "Size Master");

          }
        })
        break;

      // Agar Update krna hai toh ispe
      case DBOperation.update:

        this._dataService.post(Global.BASE_API_PATH + "SizeMaster/Update/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._toaster.success("Record has been updated successfully", "Size Master");
            this.resetForm();

          }
          else {
            this._toaster.error(res.errors[0], "Size Master");

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

  // this if for if we click on cancel on 'Add'
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
    this.objRow = this.objRows.find(x => x.id === _id); // objRows me saara data hai // find single row return krta hai
    this.addForm.controls['id'].setValue(this.objRow.id);
    this.addForm.controls['name'].setValue(this.objRow.name);


  }

  // For Deleting the record
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
        this._dataService.post(Global.BASE_API_PATH + "SizeMaster/Delete", obj).subscribe(res => {
          if (res.isSuccess) {

            Swal.fire(
              'Deleted!',
              'Your Record has been deleted.',
              'success'
            )
            this.getData();
          }
          else {
            this._toaster.error(res.errors[0], "Size Master");

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

  // agar maine edit kra then maine view tab pe click kra.
  // Than maine fir Add pe click kra toh edit vaali e details aa gyi Joh ki galat hai. Uske liye hai yeh
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
