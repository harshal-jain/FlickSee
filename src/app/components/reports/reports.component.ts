import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { Global } from 'src/app/shared/services/global';
import * as chartData from '../../shared/charts/chartsData'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styles: [
  ]
})
export class ReportsComponent implements OnInit {
  //line chart start used
  lineChartOptions: any;
  lineChartColors: any;
  lineChartLegend: any;
  lineChartType: any;
  lineChartData = [];
  lineChartLabels: any
  //line chart end used
  isShowPaymentTypeChart: boolean = false;


  chart: any;
  columnChart: any;
  lineChart: any;

  invoice: [];
  settings = {
    actions: false,
    hideSubHeader: true,
    columns: {
      invoiceNo: {
        title: "Invoice No"
      },
      paymentStatus: {
        title: 'Payment Status', type: 'html'
      },
      paymentMethod: {
        title: 'Payment Method'
      },
      paymentDate: {
        title: 'Payment Date', filter: false
      },
      orderStatus: {
        title: 'Order Status', type: 'html'
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
    this.getSalesDataPaymentTypeWise();
    this.getCustomerGrowth();
    this.getChartOrderStatus_ColumnChart();
    this.getChartOrderStatus_LineChart();
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

  getSalesDataPaymentTypeWise() {
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

    // this.lineChartLabels = ["1 min.", "10 min.", "20 min", "30 min.", "40 min.", "50 min."];

    let objLineChartData = {};
    let arr = [];

    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetChartSalesDataPaymentTypeWise").subscribe(res => {
      if (res.isSuccess) {
        let allData = res.data;

        // counts: 1  date: "23-12-2019"  paymentType: "Cash On Delivery"
        this.lineChartLabels = allData.map(item => item.date).filter((value, index, self) => self.indexOf(value) === index);
        let allPaymentType = allData.map(item => item.paymentType).filter((value, index, self) => self.indexOf(value) === index);

        for (let paymenttype of allPaymentType) {
          arr = [];
          for (let date of this.lineChartLabels) {
            for (let data in allData) {
              if (paymenttype === allData[data].paymentType && date === allData[data].date) {
                arr[arr.length] = allData[data].counts;
              }
            }
          }

          objLineChartData = { data: arr, label: paymenttype };
          this.lineChartData[this.lineChartData.length] = objLineChartData;

          this.lineChartOptions = chartData.lineChartOptions;
          this.lineChartColors = chartData.lineChartColors;
          this.lineChartLegend = chartData.lineChartLegend;
          this.lineChartType = chartData.lineChartType;
          this.isShowPaymentTypeChart = true;
        }
      } else {
        this._toastr.error(res.errors[0], "Reports");
      }
    });
  }

  getCustomerGrowth() {
    let growthData = [];
    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetChartUserGrowth").subscribe(res => {
      if (res.isSuccess) {
        let allData = res.data;
        growthData = allData.map(item => item.counts);

        this.chart = {
          type: 'Line',
          data: {
            labels: [],
            series: [
              // [3, 4, 3, 5, 4, 3, 5]
              growthData
            ]
          },
          options: {
            showScale: false,
            fullWidth: !0,
            showArea: !0,
            label: false,
            width: '1200',
            height: '358',
            low: 0,
            offset: 0,
            axisX: {
              showLabel: false,
              showGrid: false
            },
            axisY: {
              showLabel: false,
              showGrid: false,
              low: 0,
              offset: -10,
            },
          }
        };
      } else {
        this._toastr.error(res.errors[0], "Reports");
      }
    });
  }

  getChartOrderStatus_ColumnChart() {
    //google-chart - ColumnChart
    let objOrderStatusData = [];
    let arr = ["Date"];
    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetChartOrderStatus").subscribe(res => {
      if (res.isSuccess) {
        let allData = res.data;

        //counts: 1  date: "04-08-2021" orderStatus: "Processing"
        let allDates = allData.map(item => item.date).filter((value, index, self) => self.indexOf(value) === index);
        let allOrderStatus = allData.map(item => item.orderStatus).filter((value, index, self) => self.indexOf(value) === index);

        for (let status of allOrderStatus) {
          arr.push(status);
          //arr[arr.length] = status;
        }

        objOrderStatusData[objOrderStatusData.length] = arr;
        let varzero: any = 0;

        for (let date of allDates) {
          arr = [];
          arr.push(date);

          for (let status of allOrderStatus) {
            arr.push(varzero);
          }
         
          for (let status in allOrderStatus) {
            for (let data in allData) {
              if (allOrderStatus[status] === allData[data].orderStatus && date === allData[data].date) {
                arr[parseInt(status) + 1] = allData[data].counts;
              }
            }
          }

          objOrderStatusData[objOrderStatusData.length] = arr;

          this.columnChart = {
            chartType: 'ColumnChart',
            dataTable: objOrderStatusData,
            // [
            //   ["Year", "Sales", "Expenses"],
            //   ["100", 2.5, 3.8],
            //   ["200", 3, 1.8],
            //   ["300", 3, 4.3],
            //   ["400", 0.9, 2.3],
            //   ["500", 1.3, 3.6],
            //   ["600", 1.8, 2.8],
            //   ["700", 3.8, 2.8],
            //   ["800", 1.5, 2.8]
            // ],
            options: {
              legend: { position: 'none' },
              bars: "vertical",
              vAxis: {
                format: "decimal"
              },
              height: 340,
              width: '100%',
              colors: ["#ff7f83", "#a5a5a5"],
              backgroundColor: 'transparent'
            },
          };
        }
      } else {
        this._toastr.error(res.errors[0], "Dashboard");
      }
    });
  }

  getChartOrderStatus_LineChart() {
    //google-chart - LineChart
    // this.lineChart = {
    //   chartType: 'LineChart',
    //   dataTable: [
    //     ['Month', 'Guardians of the Galaxy', 'The Avengers'],
    //     [10, 20, 60],
    //     [20, 40, 10],
    //     [30, 20, 40],
    //     [40, 50, 30],
    //     [50, 20, 80],
    //     [60, 60, 30],
    //     [70, 10, 20],
    //     [80, 40, 90],
    //     [90, 20, 0]
    //   ],
    //   options: {
    //     colors: ["#ff8084", "#a5a5a5"],
    //     legend: { position: 'none' },
    //     height: 500,
    //     width: '100%',
    //     backgroundColor: 'transparent'
    //   },
    // };


    let objOrderStatusData = [];
    let arr = ["Date"];
    this._dataService.get(Global.BASE_API_PATH + "PaymentMaster/GetChartOrderStatus").subscribe(res => {
      if (res.isSuccess) {
        let allData = res.data;

        //counts: 1  date: "04-08-2021" orderStatus: "Processing"
        let allDates = allData.map(item => item.date).filter((value, index, self) => self.indexOf(value) === index);
        let allOrderStatus = allData.map(item => item.orderStatus).filter((value, index, self) => self.indexOf(value) === index);

        for (let status of allOrderStatus) {
          arr.push(status);
          //arr[arr.length] = status;
        }

        objOrderStatusData[objOrderStatusData.length] = arr;
        let varzero: any = 0;

        for (let date of allDates) {
          arr = [];
          arr.push(date);

          for (let status of allOrderStatus) {
            arr.push(varzero);
          }
         
          for (let status in allOrderStatus) {
            for (let data in allData) {
              if (allOrderStatus[status] === allData[data].orderStatus && date === allData[data].date) {
                arr[parseInt(status) + 1] = allData[data].counts;
              }
            }
          }

          objOrderStatusData[objOrderStatusData.length] = arr;

          this.lineChart = {
            chartType: 'LineChart',
            dataTable: objOrderStatusData,
            // [
            //   ['Month', 'Guardians of the Galaxy', 'The Avengers'],
            //   [10, 20, 60],
            //   [20, 40, 10],
            //   [30, 20, 40],
            //   [40, 50, 30],
            //   [50, 20, 80],
            //   [60, 60, 30],
            //   [70, 10, 20],
            //   [80, 40, 90],
            //   [90, 20, 0]
            // ],
            options: {
              colors: ["#ff8084", "#a5a5a5"],
              legend: { position: 'none' },
              height: 500,
              width: '100%',
              backgroundColor: 'transparent'
            },
          };
        }
      } else {
        this._toastr.error(res.errors[0], "Dashboard");
      }
    });
  }

}
