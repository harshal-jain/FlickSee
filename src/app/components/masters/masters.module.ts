import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MastersRoutingModule } from './masters-routing.module';
import { SizeComponent } from './size/size.component';
import { TagComponent } from './tag/tag.component';
import { UsertypeComponent } from './usertype/usertype.component';
import { ColorComponent } from './color/color.component';
import { CategoryComponent } from './category/category.component';
import { BrandlogoComponent } from './brandlogo/brandlogo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [
    SizeComponent,
    TagComponent,
    UsertypeComponent,
    ColorComponent,
    CategoryComponent,
    BrandlogoComponent
  ],
  imports: [
    CommonModule,
    MastersRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    NgxDatatableModule
    
  ]
})
export class MastersModule { }
