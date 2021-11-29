import { Routes } from "@angular/router";

export const contentRoutes: Routes = [
    { path: 'dashboard', loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule) },
    
];