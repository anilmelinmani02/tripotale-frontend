import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ItineraryService } from '../services/itinerary.service';

interface ModesOfTravelInterface {
  name: string,
  icon: string,
  selectedIcon: string,
  isSelected: boolean,
}

interface IntrestedActivitiesInterface {
  name: string,
  icon: string,
  filledIcon: string,
  isChoosed: boolean,
}

@Component({
  selector: 'app-customer-profiling',
  templateUrl: './customer-profiling.component.html',
  styleUrls: ['./customer-profiling.component.scss']
})
export class CustomerProfilingComponent implements OnInit {
  @ViewChild('selectCityInput', { static: false }) selectCityInput!: ElementRef;
  @ViewChild('candidateInput', { static: false }) candidateInput!: ElementRef;
  @ViewChild('peopleCountInput', { static: false }) peopleCountInput!: ElementRef;
  @ViewChild('moneySpendInput', { static: false }) moneySpendInput!: ElementRef;
  @ViewChild('activitiesSelection', { static: false }) activitiesSelection!: ElementRef;
  @ViewChild('travelModeSelection', { static: false }) travelModeSelection!: ElementRef;

  peopleCount: number = 1
  isPeopleCountValid: boolean = true;
  itineraryData: any;
  modesOfTravel: ModesOfTravelInterface[] = [
    {
      name: 'Plane',
      icon: '../../assets/img/svgForActivityies/plane.svg',
      selectedIcon: '../../assets/img/svgForActivityies/planeFilled.svg',
      isSelected: false
    },
    {
      name: 'Ship',
      icon: '../../assets/img/svgForActivityies/ship.svg',
      selectedIcon: '../../assets/img/svgForActivityies/shipFilled.svg',
      isSelected: false
    },
    {
      name: 'Bus',
      icon: '../../assets/img/svgForActivityies/bus.svg',
      selectedIcon: '../../assets/img/svgForActivityies/busFilled.svg',
      isSelected: false
    },
    {
      name: 'Train',
      icon: '../../assets/img/svgForActivityies/train.svg',
      selectedIcon: '../../assets/img/svgForActivityies/trainFilled.svg',
      isSelected: false
    }
  ]

  interestedActivities: IntrestedActivitiesInterface[] = [
    {
      name: 'Beaches',
      icon: '../../assets/img/svgForActivityies/beaches.svg',
      filledIcon: '../../assets/img/svgForActivityies/beachesFilled.svg',
      isChoosed: false,
    },
    {
      name: 'Tourist Attractions',
      icon: '../../assets/img/svgForActivityies/city.svg',
      filledIcon: '../../assets/img/svgForActivityies/cityFilled.svg',
      isChoosed: false,
    },
    {
      name: 'Outdoor Adventures',
      icon: '../../assets/img/svgForActivityies/hiking.svg',
      filledIcon: '../../assets/img/svgForActivityies/hikingFilled.svg',
      isChoosed: false,
    },
    {
      name: 'Festivals/Events',
      icon: '../../assets/img/svgForActivityies/festival.svg',
      filledIcon: '../../assets/img/svgForActivityies/festivalFilled.svg',
      isChoosed: false,
    },
    {
      name: 'Food Explorations',
      icon: '../../assets/img/svgForActivityies/restaurant.svg',
      filledIcon: '../../assets/img/svgForActivityies/restaurantFilled.svg',
      isChoosed: false,
    },
    {
      name: 'Nightlife',
      icon: '../../assets/img/svgForActivityies/nightlife.svg',
      filledIcon: '../../assets/img/svgForActivityies/nightLifeFilled.svg',
      isChoosed: false,
    },
    {
      name: 'Shopping',
      icon: '../../assets/img/svgForActivityies/online-shopping.svg',
      filledIcon: '../../assets/img/svgForActivityies/online-shopping-Filled.svg',
      isChoosed: false,
    },
    {
      name: 'Spa Wellness',
      icon: '../../assets/img/svgForActivityies/massage.svg',
      filledIcon: '../../assets/img/svgForActivityies/massageFilled.svg',
      isChoosed: false,
    },
  ]

  searchTerm: string = ''
  filteredCities: string[] = []
  showPromptMessage: boolean = false
  searchQuery: string = ''
  selectedCities: string[] = [];
  selectedActivities: any[] = [];
  selectedModeOfTravell: any = '';
  cityChips: any[] = []
  moneyCount: number = 1
  isMoneyCountValid: boolean = true
  searchCan: string = '';
  listCandidate: boolean = false
  selectedCandidate: string = '';
  showCityList: boolean = false;
  showRequireCity: boolean = false;
  showReqActivity: boolean = false;
  showReqTravelMode: boolean = false;
  unselectedCandidate: boolean = false;
  allStates: any[] = [];
  allCities: any[] = [];
  indiaAllCitiList: any[] = [];

  myForm: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private itineraryService: ItineraryService,
  ) {
    this.myForm = this.fb.group({
      selectCity: [''],
      peopleCount: ['', [Validators.required]],
      selectCandidate: ['', Validators.required],
      moneySpend: ['', [Validators.required]],
      selectActivity: [''],
      modeOfTravell: [''],
    });

    // For fetch all Indian cities
    this.itineraryService.getCitiesData().subscribe(
      (result) => {
        // result.states.map((m,index)=>m.cities.map(e=>({...e, stateName:m.name})))
        console.log("getCities API data:", result);
        const allStates = (result.states);
        allStates.forEach((st: any) => {
          st.cities.forEach((ct: any) => {
            this.indiaAllCitiList.push(ct.name)
          })
        })

      }
    )
    // console.log(this.indiaAllCitiList);

  }

  ngOnInit(): void {

  }

  onSubmit() {
    this.myForm.get('selectCity')?.setValue(this.selectedCities);
    this.myForm.get('selectActivity')?.setValue(this.selectedActivities)
    this.myForm.get('modeOfTravell')?.setValue(this.selectedModeOfTravell)
    this.itineraryData = (this.myForm.value);
    let logedUserId = localStorage.getItem('userId');
    this.itineraryData.userId = logedUserId;
    this.itineraryData.date = new Date().toLocaleDateString();
    this.itineraryData.time = new Date().toLocaleTimeString();

    // scroll up to error field
    if (this.selectedCities.length < 1) {
      this.showRequireCity = true;
      if (this.showRequireCity && this.selectCityInput && this.selectCityInput.nativeElement) {
        this.selectCityInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      this.showRequireCity = false;
    }

    if (this.myForm.get('peopleCount')?.invalid) {
      this.peopleCountInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (this.selectedCandidate.length < 1) {
      this.candidateInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (this.myForm.get('moneySpend')?.invalid) {
      this.moneySpendInput.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (this.selectedActivities.length < 1) {
      this.showReqActivity = true;
      this.activitiesSelection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    else {
      this.showReqActivity = false;
    }

    if (this.selectedModeOfTravell === '') {
      this.showReqTravelMode = true;
      this.travelModeSelection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      this.showReqTravelMode = false;
    }

    if (this.selectedCandidate == '') {
      this.unselectedCandidate = true;
    }

    // add data to firestore
    if (this.myForm.valid && this.selectedActivities.length > 0 && this.selectedCities.length > 0 && (this.selectedModeOfTravell !== '')) {
      this.itineraryService.addData(this.itineraryData)
        .then(res => {
          console.log('data is added in firestore ', res);
        })
        .catch(err => {
          console.error(err)
        })
    }

    //add form values data in api 
    this.http.post(`http://localhost:8000/api/itineraryData`, this.itineraryData).subscribe(
      res => {
        console.log(res);
      })

    if (this.myForm.valid && this.selectedActivities.length > 0 && this.selectedCities.length > 0 && (this.selectedModeOfTravell !== '')) {
      this.router.navigate(['/itinarary-details'])
    }
    // this.myForm.reset();
    // this.selectedCities = [];
    this.myForm.get('selectCity')?.setValue('');
  }

  @ViewChild('candidateList') candidateList!: ElementRef;
  @ViewChild('cityList') cityList!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.candidateList && !this.candidateList.nativeElement.contains(event.target)) {
      this.listCandidate = false;
    }
    if (this.cityList && !this.cityList.nativeElement.contains(event.target)) {
      this.filteredCities.length = 0;
    }
  }

  selectModeOfTravel(mode: ModesOfTravelInterface): void {
    this.modesOfTravel.forEach(mode => mode.isSelected = false);
    mode.isSelected = !mode.isSelected;
    // console.log(mode.name);
    this.selectedModeOfTravell = mode.name;
    this.showReqTravelMode = false;
  }

  selectInterestActivity(activity: IntrestedActivitiesInterface): void {
    activity.isChoosed = !activity.isChoosed;
    if (activity.isChoosed) {
      this.selectedActivities.push(activity.name);
      this.showReqActivity = false;
    } else
      if (!activity.isChoosed) {
        const indexToRemove = this.selectedActivities.indexOf(activity.name);
        this.selectedActivities.splice(indexToRemove, 1);
        // this.showReqActivity = true;
      }
  }

  validateInput(): void {
    if (this.peopleCount < 1 || this.peopleCount > 50) this.isPeopleCountValid = false
    this.isPeopleCountValid = true
  }

  moneyInput() {
    if (this.moneyCount < 1 || this.moneyCount > 360) this.isMoneyCountValid = false
    this.isMoneyCountValid = true
  }

  selectCandidate(candidate: any) {
    // console.log(candidate)
    this.selectedCandidate = candidate
    this.listCandidate = false;
    this.unselectedCandidate = false
  }

  indianCitiesWithStates: string[] = [
    'Mumbai (MH)',
    'Delhi (DL)',
    'Bangalore (KA)',
    'Hyderabad (TL)',
    'Chennai (TN)',
    'Kolkata (WB)',
    'Ahmedabad (GJ)',
    'Pune (MH)',
    'Surat (GJ)',
    'Jaipur (Rj)',
    'Lucknow (UP)',
    'Kanpur (UP)',
    'Nagpur (MH)',
    'Indore (MP)',
    'Thane (MH)',
    'Bhopal (MP)',
    'Visakhapatnam (AP)',
    'Pimpri-Chinchwad (MH)',
    'Patna (BH)',
    'Vadodara (GJ)',
    // ... add more cities with states and country code as needed
  ]

  travelCandidate: string[] = [
    'Friends',
    'Couple',
    'Family',
    'Single',
  ]

  onSearch() {
    this.filteredCities = this.indiaAllCitiList.filter(city =>
      city.toLowerCase().includes(this.searchQuery.toLowerCase()))
  }

  onInputFocus() {
    this.showPromptMessage = !this.showPromptMessage
  }

  showCandidate() {
    this.listCandidate = !this.listCandidate
  }

  onInputBlur() {
    this.showPromptMessage = false;
  }

  onSelectCity(city: string) {
    if (this.selectedCities.includes(city)) {
      this.selectedCities = this.selectedCities.filter(selectedCity => selectedCity !== city)
    } else {

      this.selectedCities.push(city);
      this.showRequireCity = false;

      //    #cityname only
      // const cityWords = city.split(/\s+/)
      // const cityOnly = cityWords[0]
      // this.selectedCities.push(cityOnly)

      this.searchQuery = ''
    }
    this.filteredCities = []
  }
  removeCity(index: number): void {
    this.selectedCities.splice(index, 1)
  }

}
function onDocumentClick(event: Event | undefined, Event: { new(type: string, eventInitDict?: EventInit | undefined): Event; prototype: Event; readonly NONE: 0; readonly CAPTURING_PHASE: 1; readonly AT_TARGET: 2; readonly BUBBLING_PHASE: 3; }) {
  throw new Error('Function not implemented.');
}
