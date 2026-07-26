import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { App1517Page } from './app-15-17.page';

const routes: Routes = [
  {
    path: '',
    component: App1517Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class App1517PageRoutingModule {}
