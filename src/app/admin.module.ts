import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {FormsModule} from '@angular/forms';

import {AdminPageComponent } from "./admin-page.component";

const admRoutes: Routes = [
    { path: '',
      component: AdminPageComponent
    }
    // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(admRoutes),
    CommonModule,
    FormsModule
  ],
  declarations:[
    AdminPageComponent
  ],
  exports: [RouterModule]
})
export class AdminModule {}
