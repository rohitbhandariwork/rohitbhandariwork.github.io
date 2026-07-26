import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterviewPage } from './interview.page';

describe('InterviewPage', () => {
  let component: InterviewPage;
  let fixture: ComponentFixture<InterviewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
