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
suggestionsData: any[] = [];
triviaData: any[] = []

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
    this.cityDetails = this.itineraryData.additionalInformation;
    this.suggestionsData = this.itineraryData.suggestions;
    this.triviaData = this.itineraryData.trivia;
    
      this.cardsData = data.data.tripPlans[0].activities ;   
      // console.log('allPlanes',this.cardsData);

      this.fetchCommentData();
    },
    (error) => {
      console.error('Error fetching itinerary data:', error);
    }
  );
}

fetchCommentData(){
  this.itineraryService.getCommentsData().subscribe((data)=>{
    console.log('comment data :', data);
  },
  (error) => {
    console.error('Error while fetching comments data:', error);
  })
}

wrapWithAnchorTag(sentence: string, wordToWrap: string, link: string): string {
  const regex = new RegExp(`(${wordToWrap})`, 'gi');
  return sentence.replace(regex, `<a href="${link}" target="_blank" class="text-[#507DBE]">$1</a>`);
}

}
