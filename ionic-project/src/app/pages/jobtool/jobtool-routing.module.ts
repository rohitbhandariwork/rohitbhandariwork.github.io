import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobtoolPage } from './jobtool.page';

const routes: Routes = [
  {
    path: '',
    component: JobtoolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobtoolPageRoutingModule {}
