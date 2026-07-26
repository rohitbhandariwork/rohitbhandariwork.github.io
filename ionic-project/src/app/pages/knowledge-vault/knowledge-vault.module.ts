import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KnowledgeVaultPageRoutingModule } from './knowledge-vault-routing.module';

import { KnowledgeVaultPage } from './knowledge-vault.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KnowledgeVaultPageRoutingModule
  ],
  declarations: [KnowledgeVaultPage]
})
export class KnowledgeVaultPageModule {}
