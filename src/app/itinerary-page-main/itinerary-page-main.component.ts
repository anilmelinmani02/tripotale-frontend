import { Component, DebugElement, Input, NgZone, OnInit, Renderer2 } from '@angular/core';
import { ItineraryService } from '../services/itinerary.service';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import { ActivatedRoute, Router } from '@angular/router';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { boundingExtent } from 'ol/extent';
import { easeOut } from 'ol/easing';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-itinerary-page-main',
  templateUrl: './itinerary-page-main.component.html',
  styleUrls: ['./itinerary-page-main.component.scss']
})
export class ItineraryPageMainComponent implements OnInit {
  like: boolean = false;
  unlike: boolean = false;
  itineraryData: any;
  cardsData: any[] = [];
  estimatedCostData: any = {};
  localCuisine: any[] = [];
  highRatetRestaurants: any[] = [];
  cityDetails: any = {};
  suggestionsData: any[] = [];
  triviaData: any[] = [];
  map: Map = new Map();
  markerOverlay !: Overlay;
  allCoords: any[] = [];
  currentZoom: any;
  coordinates: any[] = [];
  selectedCities: any;
  userId: any;
  docId: any;
  gptResponse: any;
  allDaysTripPlans: any[] = [];
  days: any[] = [];
  plan: any[] = [];
  tripDetailsSecondary: any = {};
  city1: any = {};
  citiImageUrl: string = '';
  tripSpotsLocation: any[] = [];
  allSpotsLocation: any[] = [];
  cardHover: boolean = false
  allActivities: any[] = [];
  mapCardObj: any = {}
  shoulderMonths: any[] = [];
  likedPlaces = new Set;
  dislikedPlaces = new Set;
  userRequestedData: any;
  showTooltip: boolean = false;
  showTicketTooltip: boolean = false;
  showSecondTicketTooltip: boolean = false;
  isGenerating: boolean = false;
  itineraryURL: string;
  isUserLoggedIn: any = '';
  showModal: boolean = false;
  isCollectionStoredInDB: boolean = false;
  isCollectionSaved:boolean =false;
  loading: boolean = false;

  constructor(
    private itineraryService: ItineraryService,
    private router: Router,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    this.toastr.toastrConfig.positionClass = 'toast-top-center';
    this.route.queryParams.subscribe((params => {
      this.userId = params['userId'];
      this.docId = params['docId'];
      this.selectedCities = params['selectCity'];
    }));
    this.itineraryURL = window.location.href;
    this.isUserLoggedIn = sessionStorage.getItem('logedIn');
    console.log('is user logged in--', this.isUserLoggedIn);
  }
  ngOnInit() {
    const storedObject = sessionStorage.getItem('sharedObject');
    if (storedObject) {
      this.userRequestedData = JSON.parse(storedObject);
    }

    // fetch itinerary data object from firestore DB
    this.firestore.doc(`/users/${this.userId}/tripPlans/${this.docId}`).valueChanges().subscribe((res: any) => {
      console.log("user trip-plan from firestore database", res);
      this.gptResponse = res.userTrip;

      console.log("gptResponse=>", this.gptResponse);
      // day-wise trip plans
      this.allDaysTripPlans = this.gptResponse?.tripPlans
      console.log('day-wise trip plans=>', this.allDaysTripPlans);
      this.allDaysTripPlans.forEach(act => {
        // this.allActivities.push(act?.activities)
        this.allActivities.push(act?.activities)
      })
      console.log("all activites --->", this.allActivities);

      this.city1 = this.allDaysTripPlans[0].moreAboutCity

      // cordinates
      this.allDaysTripPlans.forEach(plans => {
        plans.activities.forEach((cords: any) => {
          this.allSpotsLocation.push([cords.coordinates.longitude, cords.coordinates.latitude])
        })
      })
      console.log("places to pin", this.allSpotsLocation);

      this.citiImageUrl = this.city1.cityImageUrl;

      // for estimated,cuisin,sugg..
      this.tripDetailsSecondary = this.gptResponse?.moreTripDetails
      console.log("tripDetails", this.tripDetailsSecondary);
      // cuision
      this.localCuisine = this.tripDetailsSecondary.localCuisine
      // shoulderMonths
      this.shoulderMonths = this.tripDetailsSecondary.shoulderMonths
      console.log("shoulderMonths", this.shoulderMonths);

      // initilizing Map
      this.initializeMap();

    },
      (error) => {
        console.log('error occured while fetching data from firebase', error);
      })

    // here is old way of fetch data from api and bind directly to ui side.
    // this.gptResponse = this.itineraryService?.aiResponse[0]?.userTrip;
  }

  ngAfterViewInit() {
    // initilizing Map
    // this.initializeMap();
  }

  initializeMap() {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([73.85583967, 18.52015859]),
        zoom: 8
      })
    });

    const markerLayer = new VectorLayer({
      source: new VectorSource(),
    });

    this.map.addLayer(markerLayer);

    this.allSpotsLocation.forEach((location, index) => {
      const pinOverlay = new Overlay({
        position: fromLonLat(location),
        element: document.createElement('div'),
        stopEvent: true,
      });

      // div for pin's image
      const imgDiv = document.createElement('div');
      imgDiv.className = 'w-2 h-2 bg-black';
      const pinElement = document.createElement('img');
      pinElement.src = '../../assets/img/location-pin.png';
      pinElement!.className = 'w-8 h-8';
      pinElement.alt = 'Pin';

      // div for numbering locations
      const numberDiv = document.createElement('div');
      numberDiv.className = 'pin-number flex items-center justify-center bg-black text-white w-3 h-3 rounded-full text-[10px] absolute top-[30px] left-[10px]';
      numberDiv.textContent = (index + 1).toString();

      pinElement.addEventListener('click', () => {
        this.showLocationName(location);
      });

      // Remove location name when mouse leaves the pin
      pinElement.addEventListener('mouseout', () => {
        // this.hideLocationName();
      });

      pinOverlay.getElement()?.appendChild(numberDiv);
      pinOverlay.getElement()?.appendChild(pinElement);

      this.map.addOverlay(pinOverlay);
    })

    const coordinates = this.allSpotsLocation.map(location => fromLonLat(location));
    const extent = boundingExtent(coordinates);

    // Fit the view to the bounding box
    this.map.getView().fit(extent, { padding: [20, 20, 20, 20], maxZoom: 10 });

  }

  showLocationName(name: string) {

    this.allDaysTripPlans.forEach((e) => {
      for (const iterator of e.activities) {
        console.log(`Location Name: ${iterator.placeName}`);
      }
    })
  }

  hideLocationName() {
    // Implement logic to hide the location name (e.g., remove the tooltip)
    console.log('Hide Location Name');
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

  wrapWithAnchorTag(sentence: string, wordToWrap: string, link: string): string {
    const regex = new RegExp(`(${wordToWrap})`, 'gi');
    return sentence.replace(regex, `<a href="${link}" target="_blank" class="text-[#507DBE]">$1</a>`);
  }

  // for focus/view hovered place
  sendCord(cardNo: any, cords: any[]) {
    this.cardHover = false
    const lonLat = fromLonLat(cords);
    this.map.getView().animate({
      center: lonLat,
      duration: 2500,
      zoom: 16,
      easing: easeOut
    });
  }


  hoverOnCard(day: any, cardNo: any, activity: any) {
    this.cardHover = true
    // console.log("day no", day);
    // console.log("activity__",activity);
    this.mapCardObj = activity
    // console.log("card no",cardNo);

  }

  closeCard(): void {
    this.cardHover = false;
  }

  likedCardNumbers: number[] = [];
  dislikedCardNumbers: number[] = [];

  toggleLikeClick(place: any, cardNumber: number): void {
    if (!this.isLiked(place, cardNumber)) {
      this.likedCardNumbers.push(cardNumber);
      this.likedPlaces.add(place);
    } else {
      const index = this.likedCardNumbers.indexOf(cardNumber);
      if (index > -1) {
        this.likedCardNumbers.splice(index, 1);
      }
      if (this.likedPlaces.has(place)) {
        this.likedPlaces.delete(place);

      }
    }
    const index = this.dislikedCardNumbers.indexOf(cardNumber);
    if (index > -1) {
      this.dislikedCardNumbers.splice(index, 1);
    }
    if (this.dislikedPlaces.has(place)) {
      this.dislikedPlaces.delete(place)
    }
  }

  isLiked(place: any, cardNumber: number): any {
    return this.likedCardNumbers.includes(cardNumber);
  }

  toggleDislikeClick(place: any, cardNumber: number): void {
    if (!this.isDisiked(place, cardNumber)) {
      this.dislikedCardNumbers.push(cardNumber);
      this.dislikedPlaces.add(place);
    } else {
      const index = this.dislikedCardNumbers.indexOf(cardNumber);
      if (index > -1) {
        this.dislikedCardNumbers.splice(index, 1);
      }
      if (this.dislikedPlaces.has(place)) {
        this.dislikedPlaces.delete(place);
      }
    }
    const index = this.likedCardNumbers.indexOf(cardNumber);
    if (index > -1) {
      this.likedCardNumbers.splice(index, 1);
    }
    if (this.likedPlaces.has(place)) {
      this.likedPlaces.delete(place);
    }

  }

  isDisiked(place: any, cardNumber: number): boolean {
    return this.dislikedCardNumbers.includes(cardNumber);
  }

  reGenerateData(): void {
    if (this.isUserLoggedIn == "true") {
      this.isGenerating = true;
      console.log("liked places-->", this.likedPlaces);
      console.log("disliked places-->", this.dislikedPlaces);
      // const reactedPlaces = { likedPlaces: this.likedPlaces, dislikedPlaces: this.dislikedPlaces }
      this.userRequestedData.userReq.preferredPlaces = Array.from(this.likedPlaces);
      this.userRequestedData.userReq.notPreferredPlaces = Array.from(this.dislikedPlaces);
      
      this.gptResponse = "";
      this.itineraryService.getItineraryData(this.userRequestedData).subscribe(
        (regeneratedPlan) => {

          this.likedCardNumbers = [];
          this.dislikedCardNumbers = [];

          this.gptResponse = regeneratedPlan?.tripPlan.userTrip;
          console.log("regeneratedPlan", regeneratedPlan);
          console.log("new data-->>", this.gptResponse);
          
          // stop loader
          this.isGenerating = false;
          // update tripPlan in DB with regenerated one
          const regeneratedUserTrip = regeneratedPlan?.tripPlan.userTrip;
          this.firestore.doc(`/users/${this.userId}/tripPlans/${this.docId}`).update({userTrip: regeneratedUserTrip})
          .then(() => {
            console.log("Document updated successfully.");
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });

          this.gptResponse = regeneratedPlan?.tripPlan.userTrip;
          // day-wise trip plans
          this.allDaysTripPlans = this.gptResponse?.tripPlans
          console.log('day-wise trip plans=>', this.allDaysTripPlans);
          this.allDaysTripPlans.forEach(act => {
            // this.allActivities.push(act?.activities)
            this.allActivities.push(act?.activities)
          })
          console.log("all activites --->", this.allActivities);
  
          this.city1 = this.allDaysTripPlans[0].moreAboutCity
  
          // cordinates
          this.allDaysTripPlans.forEach(plans => {
            plans.activities.forEach((cords: any) => {
              this.allSpotsLocation.push([cords.coordinates.longitude, cords.coordinates.latitude])
            })
          })
          console.log("places to pin", this.allSpotsLocation);
  
          this.citiImageUrl = this.city1.cityImageUrl;
  
          // for estimated,cuisin,sugg..
          this.tripDetailsSecondary = this.gptResponse?.moreTripDetails
          console.log("tripDetails", this.tripDetailsSecondary);
          // cuision
          this.localCuisine = this.tripDetailsSecondary.localCuisine
          // shoulderMonths
          this.shoulderMonths = this.tripDetailsSecondary.shoulderMonths.cities
          console.log("shoulderMonths", this.shoulderMonths);
  
        },
        error => {
          console.error('Error while Regenerating trip plan:', error);
          this.isGenerating = false;
        })
    } else {
      this.showModal = true;
    }

  }

  toggleTooltip() {
    this.showTooltip = !this.showTooltip
  }

  shareUrl() {
    if (this.isUserLoggedIn == "true") {

      navigator.clipboard.writeText(this.itineraryURL).then(() => {
        this.toastr.success('URL copied to clipboard', '', {
        });
      })
        .catch(err => {
          this.toastr.error('Error in copying text to clipboard');
          console.error('Error in copying text to clipboard: ', err);
        })
    }else{
      this.showModal = true;
    }
  }

  onSaveCollectionClick(){
    this.isCollectionStoredInDB = !this.isCollectionStoredInDB;
    if (this.isUserLoggedIn == "true") {
      this.loading = true;
      // to update the save status in firestore
      this.itineraryService.updateCollectionSaveStatus(this.docId, this.userId, this.isCollectionStoredInDB).subscribe((res) => {
        this.toastr.success('Collectoin is updated successfully !');
        this.loading = false;
        this.isCollectionSaved = !this.isCollectionSaved
      },
      (error) => {
        console.error('Error updating collection save status:', error);
        this.loading = false;
        this.toastr.error("Failed to update collection, Try again...")
      });
    }
    else{
      this.showModal = true
    }
  }

  goToLogin(){
    this.router.navigate(['login'])
  }
}