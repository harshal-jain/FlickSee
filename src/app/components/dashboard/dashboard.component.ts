import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { Global } from 'src/app/shared/services/global';
import * as chartData from '../../shared/charts/chartsData'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  orders: [];
  settings = {
    actions: false,
    hideSubHeader: true,
    columns: {
      orderId: {
        title: "Order Id"
      },
      orderStatus: {
        title: 'Order Status', type: 'html'
      },
      paymentStatus: {
        title: 'Payment Status', type: 'html'
      },
      paymentMethod: {
        title: 'Payment Method'
      },
      paymentDate: {
        title: 'Payment Date'
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

  varorders: number;
  varshipAmt: number;
  varcashOnDelivery: number;
  varcancelled: number;


  //line chart start used
  lineChartOptions: any;
  lineChartColors: any;
  lineChartLegend: any;
  lineChartType: any;
  lineChartData = [];
  lineChartLabels: any
  //line chart end used

  isShowOrderStatusChart: boolean = false;

  //
  objCountsData = [
    {
      bgColorClass: 'bg-warning card-body',
      fontColorClass: 'font-warning',
      title: 'Orders',
      counts: 0
    },
    {
      bgColorClass: 'bg-secondary card-body',
      fontColorClass: 'font-secondary',
      title: 'Shipping Amount',
      counts: 0
    },
    {
      bgColorClass: 'bg-primary card-body',
      fontColorClass: 'font-primary',
      title: 'Cash On Delivery',
      counts: 0
    },
    {
      bgColorClass: 'bg-danger card-body',
      fontColorClass: 'font-danger',
      title: 'Cancelled',
      counts: 0
    }
  ];

  constructor(private _dataService: DataService, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.getData();
    this.getDataForCountTo();
    this.getChartOrderStatus();
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

  getDataForCountTo() {
    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetReportNetFigure").subscribe(res => {
      if (res.isSuccess) {
        // this.varcancelled = res.data[0].cancelled;
        // this.varcashOnDelivery = res.data[0].cashOnDelivery;
        // this.varorders = res.data[0].orders;
        // this.varshipAmt = res.data[0].shippingAmount;

        this.objCountsData[0].counts = res.data[0].orders ? res.data[0].orders : 0;
        this.objCountsData[1].counts = res.data[0].shippingAmount ? res.data[0].shippingAmount : 0;
        this.objCountsData[2].counts = res.data[0].cashOnDelivery ? res.data[0].cashOnDelivery : 0;
        this.objCountsData[3].counts = res.data[0].cancelled ? res.data[0].cancelled : 0;
      } else {
        this._toastr.error(res.errors[0], "Orders");
      }
    });
  }

  getChartOrderStatus() {
    // this.lineChartOptions = chartData.lineChartOptions;
    // this.lineChartColors = chartData.lineChartColors;
    // this.lineChartLegend = chartData.lineChartLegend;
    // this.lineChartType = chartData.lineChartType;
    // this.lineChartData = [
    //   { data: [1, 1, 2, 1, 2, 2], label: 'Series A' },
    //   { data: [0, 1, 1, 2, 1, 1], label: 'Series B' },
    //   { data: [0, 1, 0, 1, 2, 1], label: 'Series C' },
    //   { data: [1, 2, 3, 2, 1, 3], label: 'Series D' }
    // ];

    //this.lineChartLabels = ["1 min.", "10 min.", "20 min", "30 min.", "40 min.", "50 min."];

    let objLineChartData = {};
    let arr = [];

    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetChartOrderStatus").subscribe(res => {
      if (res.isSuccess) {
        let allData = res.data;

        //counts: 1  date: "04-08-2021" orderStatus: "Processing"
        this.lineChartLabels = allData.map(item => item.date).filter((value, index, self) => self.indexOf(value) === index);
        let allOrderStatus = allData.map(item => item.orderStatus).filter((value, index, self) => self.indexOf(value) === index);

        for (let status of allOrderStatus) {
          arr = [];
          for (let date of this.lineChartLabels) {
            for (let data in allData) {
              if (status === allData[data].orderStatus && date === allData[data].date) {
                arr[arr.length] = allData[data].counts;
              }
            }
          }

          objLineChartData = { data: arr, label: status };
          this.lineChartData[this.lineChartData.length] = objLineChartData;

          this.lineChartOptions = chartData.lineChartOptions;
          this.lineChartColors = chartData.lineChartColors;
          this.lineChartLegend = chartData.lineChartLegend;
          this.lineChartType = chartData.lineChartType;
          this.isShowOrderStatusChart = true;
        }
      } else {
        this._toastr.error(res.errors[0], "Dashboard");
      }
    });
  }

}
