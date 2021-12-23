import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { ChartsModule } from 'ng2-charts';
import { ChartistModule } from 'ng-chartist';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { Ng2SmartTableModule } from 'ng2-smart-table';


@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ChartsModule,
    ChartistModule,
    Ng2GoogleChartsModule,
    Ng2SmartTableModule

  ]
})
export class ReportsModule { }
