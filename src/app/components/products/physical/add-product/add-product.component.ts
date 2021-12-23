import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { DBOperation } from 'src/app/shared/services/db-operation';
import { Global } from 'src/app/shared/services/global';
import { CharFieldValidator, NoWhiteSpaceValidator, NumericFieldValidator } from 'src/app/validations/validations.validator';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  productId: number = 0;
  addForm: FormGroup;
  submitted: boolean = false;
  dbops: DBOperation;
  buttonText: string;
  objSizes: []; // For Drop Down
  objTags: []; // For Drop Down
  objColors: []; // For Drop Down
  objCategories: []; // For Drop Down
  bigImage = "assets/images/1.jpg"; // by default image
  url = [ // this is for by default images comes right of big image
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" }
  ];

  @ViewChild('elfile') elfile: ElementRef;
  fileToUpload = []; // multiple image hold krni hai
  counter: number = 0;

  formErrors = {
    name: '',
    title: '',
    code: '',
    price: '',
    salePrice: '',
    discount: '',
    sizeId: '',
    tagId: '',
    colorId: '',
    categoryId: ''
  };

  validationMessages = {
    name: {
      required: 'Name is required',
      minlength: 'Name cannot be less than 1 char long',
      maxlength: 'Name cannot be more than 10 char long',
      noWhiteSpaceValidator: 'Only whitespace is not allowed',
      validCharField: 'Name must be contains char and space only'
    },
    title: {
      required: 'Title is required',
      minlength: 'Title cannot be less than 1 char long',
      maxlength: 'Title cannot be more than 10 char long',
      noWhiteSpaceValidator: 'Only whitespace is not allowed',
      validCharField: 'Title must be contains char and space only'
    },
    code: {
      required: 'Code is required',
      minlength: 'Code cannot be less than 1 char long',
      maxlength: 'Code cannot be more than 10 char long',
      noWhiteSpaceValidator: 'Only whitespace is not allowed',
      validCharField: 'Code must be contains char and space only'
    },
    price: {
      required: 'Price is required',
      minlength: 'Price cannot be less than 1 char long',
      maxlength: 'Price cannot be more than 10 char long',
      noWhiteSpaceValidator: 'Only whitespace is not allowed',
      validNumericField: 'Price must be contains numeric only'
    },
    salePrice: {
      required: 'Sale Price is required',
      minlength: 'Sale Price cannot be less than 1 char long',
      maxlength: 'Sale Price cannot be more than 10 char long',
      noWhiteSpaceValidator: 'Only whitespace is not allowed',
      validNumericField: 'Sale Price must be contains numeric only'
    },
    discount: {
      required: 'Discount is required',
      minlength: 'Discount cannot be less than 1 char long',
      maxlength: 'Discount cannot be more than 10 char long',
      noWhiteSpaceValidator: 'Only whitespace is not allowed',
      validNumericField: 'Discount must be contains numeric only'
    },
    sizeId: {
      required: 'Size is required'
    },
    colorId: {
      required: 'Color is required'
    },
    tagId: {
      required: 'Tag is required'
    },
    categoryId: {
      required: 'Category is required'
    }
  };

  constructor(private route: ActivatedRoute, private _fb: FormBuilder, private navRouuter: Router,
    private _toastr: ToastrService, private _dataService: DataService) {
    this.route.queryParams.subscribe(params => {
      this.productId = params['productId']
    });
  }
  ngOnInit(): void {
    this.setFormState();
    this.getSizes(); // DropDown Data
    this.getCategories(); // DropDown Data
    this.getColors(); // DropDown Data
    this.getTags(); // DropDown Data
    if (this.productId && this.productId != null && this.productId > 0) {
      this.getProductById();
      this.buttonText = "Update";
      this.dbops = DBOperation.update;
    }
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
        CharFieldValidator.validCharField
      ])],
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NoWhiteSpaceValidator.noWhiteSpaceValidator,
        CharFieldValidator.validCharField
      ])],
      code: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NoWhiteSpaceValidator.noWhiteSpaceValidator,
        CharFieldValidator.validCharField
      ])],
      price: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NoWhiteSpaceValidator.noWhiteSpaceValidator,
        NumericFieldValidator.validNumericField
      ])],
      salePrice: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NoWhiteSpaceValidator.noWhiteSpaceValidator,
        NumericFieldValidator.validNumericField
      ])],
      discount: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NoWhiteSpaceValidator.noWhiteSpaceValidator,
        NumericFieldValidator.validNumericField
      ])],
      sizeId: ['', Validators.required],
      colorId: ['', Validators.required],
      tagId: ['', Validators.required],
      categoryId: ['', Validators.required],
      quantity: [''], // counter
      isSale: [false], // checkbox
      isNew: [false], // checkbox
      shortDetails: [''],
      description: ['']
    });

    this.addForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    });

    this.addForm.controls['quantity'].setValue(1);
  }
  get f() {
    return this.addForm.controls;
  }
  onValueChanged() {
    if (!this.addForm) {
      return;
    }

    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = "";
      const control = this.addForm.get(field);

      if (control && control.dirty && control.invalid) {
        const message = this.validationMessages[field];

        for (const key of Object.keys(control.errors)) {
          if (key !== 'required') {
            this.formErrors[field] += message[key] + ' ';
          }
        }
      }
    }
  }

  // For counetr
  increment() {
    this.counter = this.counter + 1;
    this.addForm.controls['quantity'].setValue(this.counter);
  }

  // For counetr
  decrement() {
    if (this.counter > 1) {
      this.counter = this.counter - 1;
      this.addForm.controls['quantity'].setValue(this.counter);
    }
  }

  // this is for small images upload
  upload(files: any, i: number) {

    if (files.length === 0) {
      return;
    }

    let type = files[0].type;
    if (type.match(/image\/*/) == null) {
      this.elfile.nativeElement.value = "";
      this._toastr.error("Please upload valid image !!", "Add Product");
    }

    // jis index ke liye image upload krenge usi index pe image upload ho jaaega
    this.fileToUpload[i] = files[0];

    //read Image
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.url[i].img = reader.result.toString(); // hume ab yeh image url me rakhna hoga
      this.bigImage = reader.result.toString(); // usme joh us time pe upload krenge voh image dikhega
    };
  }

  // Drop Down - Size
  getSizes() {
    this._dataService.get(Global.BASE_API_PATH + "SizeMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objSizes = res.data;
      } else {
        this._toastr.error(res.errors[0], "Add Product");
      }
    });
  }

  // Drop Down - Tags
  getTags() {
    this._dataService.get(Global.BASE_API_PATH + "TagMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objTags = res.data;
      } else {
        this._toastr.error(res.errors[0], "Add Product");
      }
    });
  }

  // Drop Down - colors
  getColors() {
    this._dataService.get(Global.BASE_API_PATH + "ColorMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objColors = res.data;
      } else {
        this._toastr.error(res.errors[0], "Add Product");
      }
    });
  }

  // Drop Down - Categories
  getCategories() {
    this._dataService.get(Global.BASE_API_PATH + "Category/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objCategories = res.data;
      } else {
        this._toastr.error(res.errors[0], "Add Product");
      }
    });
  }

  // jab hum product-list ke edit pe click krenge toh konsa product hai uski id aa jaaegi
  getProductById() {
    this._dataService.get(Global.BASE_API_PATH + "ProductMaster/GetbyId/" + this.productId).subscribe(res => {
      if (res.isSuccess) {
        this.addForm.patchValue(res.data);
        this.addForm.controls['isSale'].setValue(res.data.isSale === 1 ? true : false);
        this.addForm.controls['isNew'].setValue(res.data.isNew === 1 ? true : false);

        this.counter = res.data.quantity; // edit ke time pe joh bhi quantity ho voh aa jaae

        this._dataService.get(Global.BASE_API_PATH + "ProductMaster/GetProductPicturebyId/" + this.productId).subscribe(res => {
          if (res.isSuccess) {
            if (res.data.length > 0) {
              this.url = [
                { img: res.data[0].name != null ? Global.BASE_IMAGES_PATH + res.data[0].name : "assets/images/noimage.png" },
                { img: res.data[1].name != null ? Global.BASE_IMAGES_PATH + res.data[1].name : "assets/images/noimage.png" },
                { img: res.data[2].name != null ? Global.BASE_IMAGES_PATH + res.data[2].name : "assets/images/noimage.png" },
                { img: res.data[3].name != null ? Global.BASE_IMAGES_PATH + res.data[3].name : "assets/images/noimage.png" },
                { img: res.data[4].name != null ? Global.BASE_IMAGES_PATH + res.data[4].name : "assets/images/noimage.png" }
              ];
            }
          } else {
            this._toastr.error(res.errors[0], "Add Product");
          }
        });
      } else {
        this._toastr.error(res.errors[0], "Add Product");
      }
    });
  }
  Submit() {
    if (this.dbops === DBOperation.create && this.fileToUpload.length < 5) {
      this._toastr.error("Please upload 5 image per product!!", "Add Product");
      return;
    } else if (this.dbops == DBOperation.update && (this.fileToUpload.length > 0 && this.fileToUpload.length < 5)) {
      this._toastr.error("Please upload 5 image per product!!", "Add Product");
      return;
    }

    const formData = new FormData();
    formData.append("Id", this.addForm.controls['id'].value);
    formData.append("Name", this.addForm.controls['name'].value);
    formData.append("Title", this.addForm.controls['title'].value);
    formData.append("Code", this.addForm.controls['code'].value);
    formData.append("Price", this.addForm.controls['price'].value);
    formData.append("SalePrice", this.addForm.controls['salePrice'].value);
    formData.append("Discount", this.addForm.controls['discount'].value);
    formData.append("SizeId", this.addForm.controls['sizeId'].value);
    formData.append("ColorId", this.addForm.controls['colorId'].value);
    formData.append("TagId", this.addForm.controls['tagId'].value);
    formData.append("CategoryId", this.addForm.controls['categoryId'].value);
    formData.append("Quantity", this.addForm.controls['quantity'].value);
    formData.append("IsSale", this.addForm.controls['isSale'].value);
    formData.append("IsNew", this.addForm.controls['isNew'].value);
    formData.append("ShortDetails", this.addForm.controls['shortDetails'].value);
    formData.append("Description", this.addForm.controls['description'].value);

    // This is for - we are uploading 5 images
    if (this.fileToUpload) {
      for (let i = 0; i < this.fileToUpload.length; i++) {
        let ToUpload = this.fileToUpload[i];
        formData.append("Image", ToUpload, ToUpload.name);
      }
    }

    switch (this.dbops) {
      case DBOperation.create:
        this._dataService.postImage(Global.BASE_API_PATH + "ProductMaster/Save/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Record has been saved successfully !!", "Add Product");
            this.cancelForm();
          } else {
            this._toastr.error(res.errors[0], "Add Product");
          }
        });
        break;
      case DBOperation.update:
        this._dataService.postImage(Global.BASE_API_PATH + "ProductMaster/Update/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Record has been updated successfully !!", "Add Product");
            this.cancelForm();
          } else {
            this._toastr.error(res.errors[0], "Add Product");
          }
        });
        break;
    }
  }
  cancelForm() {
    this.submitted = false;
    this.dbops = DBOperation.create;
    this.buttonText = "Submit";
    this.addForm.reset({
      id: 0,
      name: '',
      title: '',
      code: '',
      price: '',
      salePrice: '',
      discount: '',
      sizeId: '',
      tagId: '',
      colorId: '',
      categoryId: '',
      quantity: '',
      isSale: false,
      isNew: false,
      shortDetails: '',
      description: ''
    });
    this.fileToUpload = [];
    
    this.url = [
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" }
    ];
    this.navRouuter.navigate(['/products/physical/product-list']);
  }

  ngOnDestroy() {
    this.fileToUpload = [];
    this.objCategories = null;
    this.objColors = null;
    this.objSizes = null;
    this.objTags = null;
    this.url = [];
  }
}
