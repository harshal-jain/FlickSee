import { Routes } from "@angular/router";

export const contentRoutes: Routes = [
    { path: 'dashboard', loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule) },
    { path : "masters", loadChildren: () => import('../../components/masters/masters.module').then(m => m.MastersModule)},
    
];