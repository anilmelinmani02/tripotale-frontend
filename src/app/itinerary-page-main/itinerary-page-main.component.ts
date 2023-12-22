import { Component, Input } from '@angular/core';
import { ItineraryService } from '../services/itinerary.service';

@Component({
  selector: 'app-itinerary-page-main',
  templateUrl: './itinerary-page-main.component.html',
  styleUrls: ['./itinerary-page-main.component.scss']
})
export class ItineraryPageMainComponent {
like: boolean = false;
unlike:boolean = false;
itineraryData: any;
cardsData: any[] = [];
estimatedCostData : any = {};
localCuisine: any[] = [];
highRatetRestaurants: any[] = [];
cityDetails: any = {};

constructor(private itineraryService: ItineraryService) {
  const selectedCity = 'Pune';
  this.fetchItineraryData(selectedCity);
}

fetchItineraryData(selectedCity: string): void {
  this.itineraryService.getItineraryData(selectedCity).subscribe(
    (data) => { 
      this.itineraryData = data.data;
      console.log('itinerary Data', this.itineraryData);
      
    this.estimatedCostData =  this.itineraryData.estimatedBudget
    console.log(this.estimatedCostData);

    this.localCuisine = this.itineraryData.localCuision;
    this.highRatetRestaurants = this.itineraryData.highRatedRestaurants;
    this.cityDetails = this.itineraryData.additionalInformation
    
      this.cardsData = data.data.tripPlans[0].activities ;   
      // console.log('allPlanes',this.cardsData);
    },
    (error) => {
      console.error('Error fetching itinerary data:', error);
    }
  );
}


  // cardsData = [
  //   {
  //     title: 'Faisal Mosque',
  //     location: 'Islamabad',
  //     category: 'seeing',
  //     description: 'Visit the iconic Faisal Mosque, one of the largest mosques in the world.',
  //     imageSrc: '../../assets/img/div.flex-none.png'
  //   },
  //   {
  //     title: ' Mosque',
  //     location: 'Islamabad 2',
  //     category: 'seeing',
  //     description: 'Visit the iconic Faisal Mosque, one of the largest mosques in the world.',
  //     imageSrc: '../../assets/img/div.flex-none.png'
  //   },
  //   {
  //     title: 'Fhjsbxhskj',
  //     location: 'Islamabad 3',
  //     category: 'seeing',
  //     description: 'Visit the iconic Faisal Mosque, one of the largest mosques in the world.',
  //     imageSrc: '../../assets/img/div.flex-none.png'
  //   },
  //   {
  //     title: 'Faisal ',
  //     location: 'Islamabad br',
  //     category: 'seeing',
  //     description: 'Visit the iconic Faisal Mosque, one of the largest mosques in the world.',
  //     imageSrc: '../../assets/img/div.flex-none.png'
  //   },
  // ]
}
