import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { App18plusPageRoutingModule } from './app-18plus-routing.module';
import { App18plusPage } from './app-18plus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    App18plusPageRoutingModule
  ],
  declarations: [App18plusPage]
})
export class App18plusPageModule {}
