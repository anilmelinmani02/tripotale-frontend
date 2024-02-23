import {
  Component,
  DebugElement,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
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
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-itinerary-page-main',
  templateUrl: './itinerary-page-main.component.html',
  styleUrls: ['./itinerary-page-main.component.scss'],
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
  markerOverlay!: Overlay;
  allCoords: any[] = [];
  currentZoom: any;
  coordinates: any[] = [];
  selectedCities: any;
  userId: any;
  docId: any;
  userTrip: any;
  days: any[] = [];
  plan: any[] = [];
  moreTripDetails: any = {};
  city1: any = {};
  citiImageUrl: string = '';
  citiImageAPi: string = '';
  tripSpotsLocation: any[] = [];
  allSpotsLocation: any[] = [];
  cardHover: boolean = false;
  allActivities: any[] = [];
  mapCardObj: any = {};
  // shoulderMonths: any = {};
  likedPlaces = new Set();
  dislikedPlaces = new Set();
  userRequestedData: any;
  showTooltip: boolean = false;
  showTicketTooltip: boolean = false;
  showSecondTicketTooltip: boolean = false;
  isGenerating: boolean = false;
  itineraryURL: string;
  isUserLoggedIn: any = '';
  showModal: boolean = false;
  isCollectionStoredInDB: boolean = false;
  isCollectionSaved: boolean = false;
  loading: boolean = false;
  ctimg: string = '';
  allPlacesImagesApi: any[] = [];
  allplacesImages: any[] = [];
  placesImagesLoading: boolean = true;
  bannerLoading: boolean = true;
  allPlacesName: any[] = [];
  imageNo: any;
  regeneratedUserTrip: any;
  processingToPDF: boolean = false;

  private imageBaseUrl = 'https://www.googleapis.com/customsearch/v1';
  private apiKey = 'AIzaSyDp7yyM3_72459eJ2sd6DF6JDzHzBOhHXU';
  // private apiKey = 'AIzaSyCwpkamdyVPIcbaAOwHpf60Ru56EibBR4M';
  private cx = 'e69c01861f05f459f';

  @ViewChild('contentToConvert', { static: false })
  public contentToConvert: ElementRef | null = null;

  constructor(
    private itineraryService: ItineraryService,
    private router: Router,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    this.toastr.toastrConfig.positionClass = 'toast-top-center';
    this.route.queryParams.subscribe((params) => {
      this.userId = params['userId'];
      this.docId = params['docId'];
      this.selectedCities = params['selectCity'];
    });
    this.itineraryURL = window.location.href;
    this.isUserLoggedIn = sessionStorage.getItem('logedIn');
  }
  ngOnInit() {
    const storedObject = sessionStorage.getItem('sharedObject');
    if (storedObject) {
      this.userRequestedData = JSON.parse(storedObject);
    }

    // fetch itinerary data object from firestore DB
    this.firestore
      .doc(`/users/${this.userId}/tripPlans/${this.docId}`)
      .valueChanges()
      .subscribe(
        (res: any) => {
          this.userTrip = res.userTrip;
          this.moreTripDetails = res?.moreTripDetails;

          // day-wise trip plans
          this.userTrip?.tripPlans.forEach((act: any) => {
            // this.allActivities.push(act?.activities)
            this.allActivities.push(act?.activities);
          });
          this.city1 = this.userTrip?.tripPlans[0].moreAboutCity;
          // cordinates
          this.userTrip?.tripPlans.forEach((plans: any) => {
            plans.activities.forEach((cords: any) => {
              this.allSpotsLocation.push([
                cords.coordinates.longitude,
                cords.coordinates.latitude,
              ]);
            });
          });

          // fetch image for for city banner
          this.citiImageAPi = `${this.imageBaseUrl}?q=${this.city1.cityName}&cx=${this.cx}&searchType=image&key=${this.apiKey}`;
          console.log('bannerApi', this.citiImageAPi);
          this.http.get(this.citiImageAPi).subscribe((res: any) => {
            console.log('citybannerimgAPI response--->', res);
            const imagesList = res.items;
            const filteredData = imagesList.find((data: any) => {
              const title = data.title.toLowerCase();
              const imgName = data.link.toLowerCase();
              return (
                title.includes('history') ||
                title.includes('population') ||
                (title.includes('wikipedia') &&
                  !(
                    imgName.includes('political_Map') || imgName.includes('map')
                  ))
              );
            });
            this.citiImageUrl = filteredData
              ? filteredData.link
              : imagesList[5].link;
            console.log(this.citiImageUrl);

            if (this.citiImageUrl.length > 1) {
              this.bannerLoading = false;
            } else {
              this.citiImageUrl = imagesList[0];
              this.bannerLoading = true;
            }
          });

          // fetching places images from apis
          this.allActivities.forEach((result) => {
            result.forEach((obj: any) => {
              // this.allPlacesImagesApi.push(obj?.imageUrl)
              this.allPlacesName.push(obj?.placeName);
            });
          });
          console.log('all places name', this.allPlacesName);
          this.allPlacesName.forEach((i) => {
            this.allPlacesImagesApi.push(
              `${this.imageBaseUrl}?q=${i}&cx=${this.cx}&searchType=image&key=${this.apiKey}`
            );
          });
          console.log('allPlacesImagesApi', this.allPlacesImagesApi);

          const observables = this.allPlacesImagesApi.map((url) =>
            this.http.get<any>(url)
          );

          forkJoin(observables).subscribe(
            (responses: any[]) => {
              this.allplacesImages = responses.map(
                (response) => response.items[0].link
              );
              console.log('Actual images urls', this.allplacesImages);
              this.placesImagesLoading = false;
            },
            (error) => {
              console.error('Error fetching image results:', error);
              this.placesImagesLoading = true;
            }
          );
          // console.log('placesImgApis-->', this.allPlacesImagesApi);
          // for estimated,cuisin,sugg..

          // cuision
          // this.localCuisine = this.moreTripDetails.localCuisine;

          // initilizing Map
          this.initializeMap();
        },
        (error) => {
          console.log('error occured while fetching data from firebase', error);
        }
      );
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
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([73.85583967, 18.52015859]),
        zoom: 8,
      }),
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
      numberDiv.className =
        'pin-number flex items-center justify-center bg-black text-white w-3 h-3 rounded-full text-[10px] absolute top-[30px] left-[10px]';
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
    });

    const coordinates = this.allSpotsLocation.map((location) =>
      fromLonLat(location)
    );
    const extent = boundingExtent(coordinates);

    // Fit the view to the bounding box
    this.map.getView().fit(extent, { padding: [20, 20, 20, 20], maxZoom: 10 });
  }

  showLocationName(name: string) {
    this.userTrip?.tripPlans.forEach((e: any) => {
      for (const iterator of e.activities) {
      }
    });
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

  wrapWithAnchorTag(
    sentence: string,
    wordToWrap: string,
    link: string
  ): string {
    const regex = new RegExp(`(${wordToWrap})`, 'gi');
    return sentence.replace(
      regex,
      `<a href="${link}" target="_blank" class="text-[#507DBE]">$1</a>`
    );
  }

  // for focus/view hovered place
  sendCord(cardNo: any, cords: any[]) {
    this.cardHover = false;
    const lonLat = fromLonLat(cords);
    this.map.getView().animate({
      center: lonLat,
      duration: 2500,
      zoom: 16,
      easing: easeOut,
    });
  }

  hoverOnCard(day: any, cardNo: any, activity: any, imgNo: any) {
    this.cardHover = true;
    this.mapCardObj = activity;
    this.imageNo = imgNo;
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
      this.dislikedPlaces.delete(place);
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
    if (this.isUserLoggedIn == 'true') {
      this.isGenerating = true;
      this.userRequestedData.userReq.preferredPlaces = Array.from(
        this.likedPlaces
      );
      this.userRequestedData.userReq.notPreferredPlaces = Array.from(
        this.dislikedPlaces
      );
      // this.userTrip = '';
      this.regeneratedUserTrip = '';
      this.itineraryService.getItineraryData(this.userRequestedData).subscribe(
        (regeneratedPlan) => {
          this.toastr.success('Trip regenerated !');
          this.likedCardNumbers = [];
          this.dislikedCardNumbers = [];
          this.regeneratedUserTrip = regeneratedPlan?.tripPlan;
          this.userTrip = this.regeneratedUserTrip?.userTrip;
          // stop loader
          this.isGenerating = false;
          // update tripPlan in DB with regenerated one
          this.firestore
            .doc(`/users/${this.userId}/tripPlans/${this.docId}`)
            .update({ userTrip: this.userTrip })
            .then(() => {})
            .catch((error) => {
              console.error(
                'Error updating old document with regenerated plan: ',
                error
              );
            });

          this.userTrip = this.regeneratedUserTrip.userTrip;
          // for estimated,cuisin,sugg..
          // this.moreTripDetails = this.regeneratedUserTrip?.moreTripDetails;
          // day-wise trip plans
          this.userTrip?.tripPlans.forEach((act: any) => {
            this.allActivities.push(act?.activities);
          });
          this.city1 = this.userTrip?.tripPlans[0].moreAboutCity;

          // cordinates
          this.userTrip?.tripPlans.forEach((plans: any) => {
            plans.activities.forEach((cords: any) => {
              this.allSpotsLocation.push([
                cords.coordinates.longitude,
                cords.coordinates.latitude,
              ]);
            });
          });

          // this.citiImageUrl = this.city1.cityImageUrl;

          // cuision
          this.localCuisine = this.moreTripDetails.localCuisine;
          // shoulderMonths
          // this.shoulderMonths = this.moreTripDetails.shoulderMonths.cities;
        },
        (error) => {
          this.toastr.error('Regenerating failed !');
          console.error('Error while Regenerating trip plan:', error);
          this.isGenerating = false;
        }
      );
    } else {
      this.showModal = true;
    }
  }

  toggleTooltip() {
    this.showTooltip = !this.showTooltip;
  }
  shareUrl() {
    if (this.isUserLoggedIn == 'true') {
      navigator.clipboard
        .writeText(this.itineraryURL)
        .then(() => {
          this.toastr.success('URL copied to clipboard', '', {});
        })
        .catch((err) => {
          this.toastr.error('Error in copying text to clipboard');
          console.error('Error in copying text to clipboard: ', err);
        });
    } else {
      this.showModal = true;
    }
  }

  onSaveCollectionClick() {
    this.isCollectionStoredInDB = !this.isCollectionStoredInDB;
    if (this.isUserLoggedIn == 'true') {
      this.loading = true;
      // to update the save status in firestore
      this.itineraryService
        .updateCollectionSaveStatus(
          this.docId,
          this.userId,
          this.isCollectionStoredInDB
        )
        .subscribe(
          (res) => {
            this.toastr.success('Collectoin is updated successfully !');
            this.loading = false;
            this.isCollectionSaved = !this.isCollectionSaved;
          },
          (error) => {
            console.error('Error updating collection save status:', error);
            this.loading = false;
            this.toastr.error('Failed to update collection, Try again...');
          }
        );
    } else {
      this.showModal = true;
    }
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  // convertToPDF(){
  //     window.print()
  // }

  convertToPDF() {
    this.hideDiv();

    window.addEventListener('beforeprint', this.hideDiv);

    window.addEventListener('afterprint', this.showDiv);

    window.print();
    window.removeEventListener('beforeprint', this.hideDiv);
    window.removeEventListener('afterprint', this.showDiv);
  }

  hideDiv() {
    const div = document.querySelector('.mapSec') as HTMLElement;
    const textSection = document.querySelector('.textSec') as HTMLElement;
    if (div !== null && textSection !== null) {
      div.style.display = 'none';
      textSection.style.justifyContent = 'center';
    }
  }

  showDiv() {
    const div = document.querySelector('.mapSec') as HTMLElement;
    const textSection = document.querySelector('.textSec') as HTMLElement;
    if (div !== null) {
      div.style.display = 'block';
      textSection.style.justifyContent = 'start';
    }
  }
}
