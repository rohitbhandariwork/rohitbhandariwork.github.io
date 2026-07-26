import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { App1517PageRoutingModule } from './app-15-17-routing.module';

import { App1517Page } from './app-15-17.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    App1517PageRoutingModule
  ],
  declarations: [App1517Page]
})
export class App1517PageModule {}
