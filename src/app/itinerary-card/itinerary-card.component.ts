import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-itinerary-card',
  templateUrl: './itinerary-card.component.html',
  styleUrls: ['./itinerary-card.component.scss']
})
export class ItineraryCardComponent {
  @Input() cardData: any;

  like: boolean = false;
  unlike:boolean = false;
  
    toggleLike() {
      this.like = !this.like;
      this.unlike = false;
    }
  
    toggleUnlike() {
      this.unlike = !this.unlike;
      this.like = false;
    }
  
  
    resetLike() {
      this.like = false;
    }
  
  
    resetUnlike() {
      this.unlike = false;
    }
}
