import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { Global } from 'src/app/shared/services/global';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styles: [
  ]
})
export class InvoiceComponent implements OnInit {

  invoice: [];
  settings = {
    actions: false, // edit or delete ke liye false kr diya hai
    columns: {
      invoiceNo: { // yeh same name hona cheye joh api se aara hai
        title: "Invoice No"
      },
      paymentStatus: {
        title: 'Payment Status', type: 'html' // type html isliye hai ki ise html ki  trha treat kre
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

  constructor(private _dataService: DataService, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetReportInvoiceList").subscribe(res => {
      if (res.isSuccess) {
        this.invoice = res.data;
      } else {
        this._toastr.error(res.errors[0], "Invoice");
      }
    });
  }
}
