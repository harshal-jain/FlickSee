import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { Global } from 'src/app/shared/services/global';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders: [];
  settings = {
    actions: false, // edit or delete ke liye false kr diya hai
    columns: {
      orderId: { // yeh same name hona cheye joh api se aara hai
        title: "Order Id"
      },
      
      paymentMethod: {
        title: 'Payment Method'
      },
      paymentDate: {
        title: 'Payment Date',filter : false // ispe filter nhi lgana
      },
      orderStatus: {
        title: 'Order Status', type: 'html' // type html isliye hai ki ise html ki  trha treat kre
      },
      shippingAmount: {
        title: 'Shipping Amount'
      },
      subTotalAmount: {
        title: 'SubTotal Amount'
      },
      totalAmount: {
        title: 'Total Amount'
      }
    }
  };

//   invoiceNo: "384585"
// orderId: "738451"
// orderStatus: "<span class=\"badge badge-warning\">Processing</span>"
// paymentDate: "2021.12.18"
// paymentMethod: "Cash On Delivery"
// paymentStatus: "<span class=\"badge badge-secondary\">Cash On Delivery</span>"
// shippingAmount: 40
// subTotalAmount: 1300
// totalAmount: 1340

  constructor(private _dataService: DataService, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetReportManageOrder").subscribe(res => {
      if (res.isSuccess) {
        
        this.orders = res.data;
      } else {
        this._toastr.error(res.errors[0], "Orders");
      }
    });
  }
}
