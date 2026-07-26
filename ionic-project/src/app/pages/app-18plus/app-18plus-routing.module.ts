import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { App18plusPage } from './app-18plus.page';

const routes: Routes = [{ path: '', component: App18plusPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class App18plusPageRoutingModule {}
