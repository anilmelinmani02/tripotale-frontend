import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryPageMainComponent } from './itinerary-page-main.component';

describe('ItineraryPageMainComponent', () => {
  let component: ItineraryPageMainComponent;
  let fixture: ComponentFixture<ItineraryPageMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItineraryPageMainComponent]
    });
    fixture = TestBed.createComponent(ItineraryPageMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
