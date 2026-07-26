import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobtoolPageRoutingModule } from './jobtool-routing.module';

import { JobtoolPage } from './jobtool.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobtoolPageRoutingModule
  ],
  declarations: [JobtoolPage]
})
export class JobtoolPageModule {}
