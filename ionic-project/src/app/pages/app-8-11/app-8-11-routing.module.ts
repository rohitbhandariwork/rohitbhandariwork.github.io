import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { App811Page } from './app-8-11.page';

const routes: Routes = [
  {
    path: '',
    component: App811Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class App811PageRoutingModule {}
