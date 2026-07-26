import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KnowledgeVaultPage } from './knowledge-vault.page';

const routes: Routes = [
  {
    path: '',
    component: KnowledgeVaultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KnowledgeVaultPageRoutingModule {}
