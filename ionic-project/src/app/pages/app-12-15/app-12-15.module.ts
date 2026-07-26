import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { App1215PageRoutingModule } from './app-12-15-routing.module';

import { App1215Page } from './app-12-15.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    App1215PageRoutingModule
  ],
  declarations: [App1215Page]
})
export class App1215PageModule {}
