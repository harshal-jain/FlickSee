import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { Global } from 'src/app/shared/services/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {

  objRows: any[];


  constructor(private _dataService: DataService, private _toaster: ToastrService, private navRoute : Router) { }


  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this._dataService.get(Global.BASE_API_PATH + "UserMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {

        this.objRows = res.data;
        debugger;
      }
      else {
        this._toaster.error("res.errors[0]", "User Master");
      }
    })
  }

  
  Edit(_id: number) {

    this.navRoute.navigate(["/users/add-user"],{queryParams:{userId : _id}}) // userId ke name se uss page pe chala jaaega

  }

  // Delete code as it is purana
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
        this._dataService.post(Global.BASE_API_PATH + "UserMaster/Delete", obj).subscribe(res => {
          if (res.isSuccess) {

            Swal.fire(
              'Deleted!',
              'Your Record has been deleted.',
              'success'
            )
            this.getData();
          }
          else {
            this._toaster.error(res.errors[0], "User Master");

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


}

