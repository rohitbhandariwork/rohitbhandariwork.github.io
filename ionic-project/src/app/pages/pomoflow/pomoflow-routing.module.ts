import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PomoflowPage } from './pomoflow.page';

const routes: Routes = [
  {
    path: '',
    component: PomoflowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PomoflowPageRoutingModule {}
