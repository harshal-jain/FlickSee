import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { FeatherIconComponent } from "./components/feather-icon/feather-icon.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { LayoutComponent } from './layout/layout.component';

@NgModule({
    declarations: [

        FooterComponent,
        HeaderComponent,
        SidebarComponent,
        FeatherIconComponent,
        BreadcrumbComponent,
        LayoutComponent
    ],
    imports: [
        CommonModule,
        RouterModule
    ],
    providers: [],
    exports:[LayoutComponent]
})
export class SharedModule { }