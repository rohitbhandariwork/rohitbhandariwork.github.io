import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { App1215Page } from './app-12-15.page';

const routes: Routes = [
  {
    path: '',
    component: App1215Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class App1215PageRoutingModule {}
