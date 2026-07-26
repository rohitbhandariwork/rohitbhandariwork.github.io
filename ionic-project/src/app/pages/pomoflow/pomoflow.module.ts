import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PomoflowPageRoutingModule } from './pomoflow-routing.module';

import { PomoflowPage } from './pomoflow.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PomoflowPageRoutingModule
  ],
  declarations: [PomoflowPage]
})
export class PomoflowPageModule {}
