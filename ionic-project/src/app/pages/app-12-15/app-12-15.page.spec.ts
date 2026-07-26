import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App1215Page } from './app-12-15.page';

describe('App1215Page', () => {
  let component: App1215Page;
  let fixture: ComponentFixture<App1215Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(App1215Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
