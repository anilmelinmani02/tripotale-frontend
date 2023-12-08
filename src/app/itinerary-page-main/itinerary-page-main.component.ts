import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-itinerary-page-main',
  templateUrl: './itinerary-page-main.component.html',
  styleUrls: ['./itinerary-page-main.component.scss']
})
export class ItineraryPageMainComponent {
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
 
  cardsData = [
    {
      title: 'Faisal Mosque',
      location: 'Islamabad',
      category: 'seeing',
      description: 'Visit the iconic Faisal Mosque, one of the largest mosques in the world.',
      imageSrc: '../../assets/img/div.flex-none.png'
    },
    {
      title: ' Mosque',
      location: 'Islamabad 2',
      category: 'seeing',
      description: 'Visit the iconic Faisal Mosque, one of the largest mosques in the world.',
      imageSrc: '../../assets/img/div.flex-none.png'
    },
    {
      title: 'Fhjsbxhskj',
      location: 'Islamabad 3',
      category: 'seeing',
      description: 'Visit the iconic Faisal Mosque, one of the largest mosques in the world.',
      imageSrc: '../../assets/img/div.flex-none.png'
    },
    {
      title: 'Faisal ',
      location: 'Islamabad br',
      category: 'seeing',
      description: 'Visit the iconic Faisal Mosque, one of the largest mosques in the world.',
      imageSrc: '../../assets/img/div.flex-none.png'
    },
  ]
}
