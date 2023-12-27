import { Component, Input, Renderer2 } from '@angular/core';
import { ItineraryService } from '../services/itinerary.service';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import { boundingExtent } from 'ol/extent';
import { Coordinate } from 'ol/coordinate';


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
triviaData: any[] = [];
map: Map = new Map();
markerOverlay !: Overlay;
allCoords: any[] = []
currentZoom:any;

constructor(
  private itineraryService: ItineraryService, 
  private renderer: Renderer2
  ) {
  const selectedCity = 'Pune';
  this.fetchItineraryData(selectedCity);
}

ngAfterViewInit() {
  this.initializeMap();
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
      console.log('allPlanes',this.cardsData);
      // extract coordinates
      this.cardsData.forEach((e)=>{
        this.allCoords.push(e.coordinates)
      })

      this.fetchCommentData();
      this.addMarker();
    },
    (error) => {
      console.error('Error fetching itinerary data:', error);
    }
  );
}

initializeMap() {
  console.log('initializing map');
  
  this.map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      zoom: 6
    })
  });
}

addMarker() {
  const markerOverlays = this.allCoords.map(coord => {
    const markerElement = this.renderer.createElement('div');
    markerElement.innerHTML = '<img src="../../assets/img/location-pin.png" alt="Marker" style="width: 32px; height: 32px;">';

    const markerOverlay = new Overlay({
      position: fromLonLat([parseFloat(coord.longitude), parseFloat(coord.latitude)]),
      element: markerElement,
      positioning: 'center-center',
      offset: [0, -16]
    });

    this.map.addOverlay(markerOverlay);
    return markerOverlay;
  });
  // Get all marker coordinates and filter out undefined values
  const markerCoordinates = markerOverlays
    .map(overlay => overlay.getPosition())
    .filter(coord => coord !== undefined) as Coordinate[];

  if (markerCoordinates.length > 0) {
    // Calculate bounding box
    const boundingBox = boundingExtent(markerCoordinates);

    // Fit the view to the bounding box
    this.map.getView().fit(boundingBox, { padding: [20, 20, 20, 20], maxZoom: 13 });
  }
}

zoomIn() {
  const view = this.map.getView();
  this.currentZoom = view.getZoom();
  view.setZoom(this.currentZoom + 1);
}

zoomOut() {
  const view = this.map.getView();
  this.currentZoom = view.getZoom();
  view.setZoom(Math.max(this.currentZoom - 1, 1));
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
