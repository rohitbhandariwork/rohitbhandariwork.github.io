import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { App47Page } from './app-4-7.page';

const routes: Routes = [
  {
    path: '',
    component: App47Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class App47PageRoutingModule {}
