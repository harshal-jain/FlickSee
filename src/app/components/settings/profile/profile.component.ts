import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { Global } from 'src/app/shared/services/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  imagePath: string = "/assets/images/user.png";
  fullName: string;
  emailId = "";
  firstName = "";
  lastName = "";
  userDetails: any;

  @ViewChild('file') elfile: ElementRef;
  addedImagePath: string = "assets/images/noimage.png";
  fileToUpload: any;

  constructor(private _toastr: ToastrService, private _dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem("userDetails"));

    this.firstName = this.userDetails.firstName;
    this.lastName = this.userDetails.lastName;
    this.emailId = this.userDetails.email;
    this.fullName = `${this.firstName} ${this.lastName}`;

    this.imagePath = (this.userDetails.imagePath == "" || this.userDetails.imagePath == null) ? "/assets/images/user.png"
      : Global.BASE_USERS_IMAGES_PATH + this.userDetails.imagePath;
  }
  upload(files: any) {
    if (files.Length === 0) {
      return;
    }

    let type = files[0].type;
    if (type.match(/image\/*/) == null) {
      this.elfile.nativeElement.value = "";
      this._toastr.error("Please upload valid image !!", "User Profile");
    }

    this.fileToUpload = files[0];

    //read Image
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.addedImagePath = reader.result.toString();
    };

  }
  ChangeProfileImage() {
    if (!this.fileToUpload) {
      this._toastr.error("Please upload image !!", "User Profile");
      return;
    }

    const formData = new FormData();
    formData.append("Id", this.userDetails.id);
    if (this.fileToUpload) {
      formData.append("Image", this.fileToUpload, this.fileToUpload.name);
    }

    this._dataService.postImage(Global.BASE_API_PATH + "UserMaster/UpdateProfile/", formData).subscribe(res => {
      if (res.isSuccess) {
        this._toastr.success("User Profile has been updated successfully !!", "User Profile");
        this.elfile.nativeElement.value = "";
        this.addedImagePath = "assets/images/noimage.png";
        //
        Swal.fire({
          title: 'Are you sure?',
          text: 'are you want to see this changes rightnow?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, rightnow!',
          cancelButtonText: 'No, keep it'
        }).then((result) => {
          if (result.value) {
         this.router.navigate(['auth/login']);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          
          }
        }
        )
        //
      } else {
        this._toastr.error(res.errors[0], "User Profile");
      }
    });
  }
  tabChange(event: any) {
    if (event.nextId == "addtab") {
      this.addedImagePath = "assets/images/noimage.png";
      this.fileToUpload = null;
    }
  }

}
