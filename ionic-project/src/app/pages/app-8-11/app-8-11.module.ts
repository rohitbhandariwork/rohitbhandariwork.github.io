import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { App811PageRoutingModule } from './app-8-11-routing.module';

import { App811Page } from './app-8-11.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    App811PageRoutingModule
  ],
  declarations: [App811Page]
})
export class App811PageModule {}
