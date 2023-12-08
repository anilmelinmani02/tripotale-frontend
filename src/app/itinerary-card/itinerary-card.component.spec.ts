import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryCardComponent } from './itinerary-card.component';

describe('ItineraryCardComponent', () => {
  let component: ItineraryCardComponent;
  let fixture: ComponentFixture<ItineraryCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItineraryCardComponent]
    });
    fixture = TestBed.createComponent(ItineraryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
