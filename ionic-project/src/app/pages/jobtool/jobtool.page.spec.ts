import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobtoolPage } from './jobtool.page';

describe('JobtoolPage', () => {
  let component: JobtoolPage;
  let fixture: ComponentFixture<JobtoolPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JobtoolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
