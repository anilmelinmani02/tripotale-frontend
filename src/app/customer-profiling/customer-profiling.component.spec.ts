import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProfilingComponent } from './customer-profiling.component';

describe('CustomerProfilingComponent', () => {
  let component: CustomerProfilingComponent;
  let fixture: ComponentFixture<CustomerProfilingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerProfilingComponent]
    });
    fixture = TestBed.createComponent(CustomerProfilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
