import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { App47PageRoutingModule } from './app-4-7-routing.module';

import { App47Page } from './app-4-7.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    App47PageRoutingModule
  ],
  declarations: [App47Page]
})
export class App47PageModule {}
