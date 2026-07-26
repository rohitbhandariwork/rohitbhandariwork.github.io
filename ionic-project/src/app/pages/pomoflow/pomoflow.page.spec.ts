import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PomoflowPage } from './pomoflow.page';

describe('PomoflowPage', () => {
  let component: PomoflowPage;
  let fixture: ComponentFixture<PomoflowPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PomoflowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
