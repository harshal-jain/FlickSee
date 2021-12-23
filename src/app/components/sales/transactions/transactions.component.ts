import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { Global } from 'src/app/shared/services/global';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  
  transactions: [];
  settings = {
    actions: false, // edit or delete ke liye false kr diya hai
    columns: {
      transactionsId: { // yeh same name hona cheye joh api se aara hai
        title: "TransactionsId"
      },
      orderStatus: {
        title: 'Order Status', type: 'html' // type html isliye hai ki ise html ki  trha treat kre
      },
      paymentMethod: {
        title: 'Payment Method'
      },
      paymentDate: {
        title: 'Payment Date',filter : false // ispe filter nhi lgana
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

//   orderId: "738451"
// orderStatus: "<span class=\"badge badge-warning\">Processing</span>"
// paymentDate: "2021.12.18"
// paymentMethod: "Cash On Delivery"
// paymentStatus: "<span class=\"badge badge-secondary\">Cash On Delivery</span>"
// shippingAmount: 40
// subTotalAmount: 1300
// totalAmount: 1340
// transactionsId:

  constructor(private _dataService: DataService, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetReportTransactionDetails").subscribe(res => {
      if (res.isSuccess) {
        
        this.transactions = res.data;
      } else {
        this._toastr.error(res.errors[0], "Transactions");
      }
    });
  }
}
