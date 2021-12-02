import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { DBOperation } from 'src/app/shared/services/db-operation';
import { Global } from 'src/app/shared/services/global';
import { CharFieldValidator, NoWhiteSpaceValidator } from 'src/app/validations/validations.validator';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-brandlogo',
  templateUrl: './brandlogo.component.html',
  styleUrls: ['./brandlogo.component.scss']
})
export class BrandlogoComponent implements OnInit, OnDestroy {

  objRows: any[];
  addForm: FormGroup;
  buttonText: string;
  objRow: any;
  dbops: DBOperation;
  @ViewChild('nav') elnav: any;
  @ViewChild('file') elfile: ElementRef;

  addedImagePath: string = "assets/images/noimage.png";
  fileToUpload: any

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

  upload(files: any) {
    if (files.Length === 0) {
      return;
    }

    let type = files[0].type;
    if (type.match(/image\/*/) == null) // this means any image extention
    {
      this.elfile.nativeElement.value = "";
      this._toaster.error("Please upload valid image !!", "Brand Logo")
    }

    this.fileToUpload = files[0];
    // read image
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.addedImagePath = reader.result.toString();
    };




  }

  get afControls() {
    return this.addForm.controls;
  }

  getData() {
    this._dataService.get(Global.BASE_API_PATH + "BrandLogo/GetAll").subscribe(res => {
      if (res.isSuccess) {
        debugger;
        this.objRows = res.data;

      }
      else {
        this._toaster.error("res.errors[0]", "Brand Logo");
      }
    })
  }

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

  Submit() {

    if (this.dbops === DBOperation.create && !this.fileToUpload) {

      this._toaster.error("Please upload image !!", "Brand Logo");
      return;

    }

    const formData = new FormData();
    formData.append("Id", this.addForm.controls['id'].value);
    formData.append("Name", this.addForm.controls['name'].value);
    if (this.fileToUpload) {
      formData.append("Image", this.fileToUpload, this.fileToUpload.name);
    }


    switch (this.dbops) {
      case DBOperation.create:
        this._dataService.postImage(Global.BASE_API_PATH + "BrandLogo/Save/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toaster.success("Record has been saved successfully", "Brand Logo");
            this.resetForm();
          }
          else {
            this._toaster.error(res.errors[0], "Brand Logo");

          }
        })
        break;

      case DBOperation.update:

        this._dataService.postImage(Global.BASE_API_PATH + "BrandLogo/Update/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toaster.success("Record has been updated successfully", "Brand Logo");
            this.resetForm();

          }
          else {
            this._toaster.error(res.errors[0], "Brand Logo");

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
    this.fileToUpload = "";
    this.elnav.select('viewtab');
    this.addedImagePath = "assets/images/noimage.png";
    this.getData();
  }

  cancelForm() {
    this.addForm.reset({
      id: 0,
      name: ""
    });
    this.buttonText = "Submit";
    this.fileToUpload = "";
    this.dbops = DBOperation.create;
    this.addedImagePath = "assets/images/noimage.png";
    this.elnav.select('viewtab');
  }

  Edit(_id: number) {
    this.buttonText = "Update";
    this.dbops = DBOperation.update;
    this.elnav.select('addtab');
    this.objRow = this.objRows.find(x => x.id === _id);
    this.addForm.controls['id'].setValue(this.objRow.id);
    this.addForm.controls['name'].setValue(this.objRow.name);
    this.addedImagePath = this.objRow.imagePath;


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
        this._dataService.post(Global.BASE_API_PATH + "BrandLogo/Delete", obj).subscribe(res => {
          if (res.isSuccess) {

            Swal.fire(
              'Deleted!',
              'Your Record has been deleted.',
              'success'
            )
            this.getData();
          }
          else {
            this._toaster.error(res.errors[0], "Brand Logo");

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
      this.fileToUpload = "";
      this.addedImagePath = "assets/images/noimage.png";

    }
  }

  ngOnDestroy() {
    this.objRows = [];
    this.objRow = null;
    this.fileToUpload = "";
    this.addedImagePath = "assets/images/noimage.png";

  }

}
