import { ModuleWithProviders } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./_layout/admin-layout.component";
import { HomeComponent } from "./home/home.component";

import { AuthGuard } from "../../auth.guard";

export const Routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    
    children: [
      { path: "", redirectTo: 'home', pathMatch: 'full'},
      { path: "home", component: HomeComponent},
      { path: "**", redirectTo: "home", pathMatch: "full" }    
    ]
  }
]);
