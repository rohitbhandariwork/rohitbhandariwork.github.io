import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KnowledgeVaultPage } from './knowledge-vault.page';

describe('KnowledgeVaultPage', () => {
  let component: KnowledgeVaultPage;
  let fixture: ComponentFixture<KnowledgeVaultPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowledgeVaultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
