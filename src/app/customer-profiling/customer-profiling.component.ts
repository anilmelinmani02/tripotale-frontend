import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  NgModel,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItineraryService } from '../services/itinerary.service';
import { ErrorModalComponent } from '../../app/alertModal/error-modal/error-modal.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface ModesOfTravelInterface {
  name: string;
  icon: string;
  selectedIcon: string;
  isSelected: boolean;
}

interface IntrestedActivitiesInterface {
  name: string;
  icon: string;
  filledIcon: string;
  isChoosed: boolean;
}

@Component({
  selector: 'app-customer-profiling',
  templateUrl: './customer-profiling.component.html',
  styleUrls: ['./customer-profiling.component.scss'],
})
export class CustomerProfilingComponent implements OnInit {
  @ViewChild('selectCityInput', { static: false }) selectCityInput!: ElementRef;
  @ViewChild('candidateInput', { static: false }) candidateInput!: ElementRef;
  @ViewChild('peopleCountInput', { static: false })
  peopleCountInput!: ElementRef;
  @ViewChild('moneySpendInput', { static: false }) moneySpendInput!: ElementRef;
  @ViewChild('journeyStartDateInput', { static: false })
  journeyStartDateInput!: ElementRef;
  @ViewChild('journeyEndDateInput', { static: false })
  journeyEndDateInput!: ElementRef;
  @ViewChild('activitiesSelection', { static: false })
  activitiesSelection!: ElementRef;
  @ViewChild('travelModeSelection', { static: false })
  travelModeSelection!: ElementRef;

  @ViewChild(ErrorModalComponent) errorModalComponent!: ErrorModalComponent;

  peopleCount: number = 1;
  isPeopleCountValid: boolean = true;
  itineraryData: any;
  modesOfTravel: ModesOfTravelInterface[] = [
    {
      name: 'Plane',
      icon: '../../assets/img/svgForActivityies/plane.svg',
      selectedIcon: '../../assets/img/svgForActivityies/planeFilled.svg',
      isSelected: false,
    },
    {
      name: 'Ship',
      icon: '../../assets/img/svgForActivityies/ship.svg',
      selectedIcon: '../../assets/img/svgForActivityies/shipFilled.svg',
      isSelected: false,
    },
    {
      name: 'Bus',
      icon: '../../assets/img/svgForActivityies/bus.svg',
      selectedIcon: '../../assets/img/svgForActivityies/busFilled.svg',
      isSelected: false,
    },
    {
      name: 'Train',
      icon: '../../assets/img/svgForActivityies/train.svg',
      selectedIcon: '../../assets/img/svgForActivityies/trainFilled.svg',
      isSelected: false,
    },
  ];

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
      filledIcon:
        '../../assets/img/svgForActivityies/online-shopping-Filled.svg',
      isChoosed: false,
    },
    {
      name: 'Spa Wellness',
      icon: '../../assets/img/svgForActivityies/massage.svg',
      filledIcon: '../../assets/img/svgForActivityies/massageFilled.svg',
      isChoosed: false,
    },
  ];
  journey: any;
  ischoosedStartDate: boolean = true;
  ischoosedEndDate: boolean = true;
  minDate: any;
  maxDate: any;
  searchTerm: string = '';
  filteredCities: string[] = [];
  showPromptMessage: boolean = false;
  searchQuery: string = '';
  selectedCities: string[] = [];
  selectedActivities: any[] = [];
  selectedModeOfTravell: any = '';
  cityChips: any[] = [];
  moneyCount: number = 1;
  isMoneyCountValid: boolean = true;
  searchCan: string = '';
  listCandidate: boolean = false;
  selectedCandidate: string = '';
  showCityList: boolean = false;
  showRequireCity: boolean = false;
  showReqActivity: boolean = false;
  showReqTravelMode: boolean = false;
  unselectedCandidate: boolean = false;
  allStates: any[] = [];
  allCities: any[] = [];
  indiaAllCitiList: any[] = [];
  loading: boolean = false;
  userInfo: any;
  faildToGenerate: boolean = false;
  myForm: FormGroup;
  leftCredits: number = 0;
  leftCreaditsDocId: string = '';
  showCreaditModal: boolean = false;
  loggedUserRefCode: string = '';
  fetchingRefCode: boolean = true;
  refereeList: any[] = [];
  updatedCredits: number = 0;
  imgApiRes: string = '';

  private imageBaseUrl = 'https://www.googleapis.com/customsearch/v1';
  private apiKey = 'AIzaSyDp7yyM3_72459eJ2sd6DF6JDzHzBOhHXU';
  // private apiKey = 'AIzaSyCwpkamdyVPIcbaAOwHpf60Ru56EibBR4M';
  private cx = 'e69c01861f05f459f';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private itineraryService: ItineraryService,
    private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) {
    this.userInfo = {
      loginStatus: sessionStorage.getItem('logedIn'),
      userId: sessionStorage.getItem('userId'),
    };
    this.minDate = this.formatStartDate(new Date());

    const referralDocRef = this.firestore
      .collection('users')
      .doc(this.userInfo.userId)
      .collection('referrals')
      .doc('referralDoc');
    referralDocRef.get().subscribe((res) => {
      const data = res.data();
      if (data) {
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            if (key === 'leftCredits') {
              this.leftCredits = data[key];
              const updatedCredits = this.leftCredits.toString();
              sessionStorage.setItem('leftCredits', updatedCredits);
            }
          }
        }
      }
    });

    this.myForm = this.fb.group({
      selectCity: [''],
      journeyStartDate: ['', [Validators.required]],
      journeyEndDate: ['', [Validators.required]],
      peopleCount: ['', [Validators.required]],
      selectCandidate: ['', Validators.required],
      moneySpend: ['', [Validators.required]],
      selectActivity: [''],
      modeOfTravell: [''],
    });

    // For fetch all Indian cities
    this.itineraryService.getCitiesData().subscribe((result) => {
      const allStates = result.states;
      allStates.forEach((st: any) => {
        st.cities.forEach((ct: any) => {
          this.indiaAllCitiList.push(ct.name);
        });
      });
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.journey = params;
      this.indiaAllCitiList.filter((city) => {
        if (city.toLowerCase().includes(this.journey?.to.toLowerCase())) {
          this.selectedCities.push(city);
        }
      });
    });
  }

  private formatStartDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    this.myForm.get('selectCity')?.setValue(this.selectedCities);
    this.myForm.get('selectActivity')?.setValue(this.selectedActivities);
    this.myForm.get('modeOfTravell')?.setValue(this.selectedModeOfTravell);

    this.itineraryData = this.myForm.value;
    let logedUserId = sessionStorage.getItem('userId');
    this.itineraryData.userId = logedUserId;
    this.itineraryData.journeyStartFrom = this.journey?.from;

    // scroll up to error field
    if (this.selectedCities.length < 1) {
      this.showRequireCity = true;
      if (
        this.showRequireCity &&
        this.selectCityInput &&
        this.selectCityInput.nativeElement
      ) {
        this.selectCityInput.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    } else {
      this.showRequireCity = false;
    }

    if (this.myForm.get('peopleCount')?.invalid) {
      this.peopleCountInput.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    if (this.selectedCandidate.length < 1) {
      this.candidateInput.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      this.unselectedCandidate = true;
    }

    if (this.myForm.get('moneySpend')?.invalid) {
      this.moneySpendInput.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    if (this.myForm.get('journeyStartDate')?.invalid) {
      this.journeyStartDateInput.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      this.ischoosedStartDate = false;
    }

    if (this.myForm.get('journeyEndDate')?.invalid) {
      this.journeyEndDateInput.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      this.ischoosedEndDate = false;
    }

    if (this.selectedActivities.length < 1) {
      this.showReqActivity = true;
      this.activitiesSelection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      this.showReqActivity = false;
    }

    if (this.selectedModeOfTravell === '') {
      this.showReqTravelMode = true;
      this.travelModeSelection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      this.showReqTravelMode = false;
    }

    if (this.selectedCandidate == '') {
      this.unselectedCandidate = true;
    }

    if (
      this.myForm.valid &&
      this.selectedActivities.length > 0 &&
      this.selectedCities.length > 0 &&
      this.selectedModeOfTravell !== ''
    ) {
      this.loading = true;
      var reqestedData: any = {
        userReq: this.itineraryData,
        userInfo: this.userInfo,
      };

      // searchCityImage
      
    // const searchImgofCity = this.myForm.get('selectCity')?.value;
    // this.http.get(`${this.imageBaseUrl}?q=${searchImgofCity}&cx=${this.cx}&searchType=image&key=${this.apiKey}`).subscribe((res: any)=>{
    //   console.log('city image from imgAPI --->', res);
    //   const imagesList = res.items;
    //   const filteredData = imagesList.find((data:any) => {
    //     const title = data.title.toLowerCase();
    //     return title.includes('history') || title.includes('population') ||title.includes('wikipedia');
    // });
    // const link = filteredData ? filteredData.link : null;
    // this.imgApiRes = link;
    // console.log('selected image-->', this.imgApiRes);
    
    //   sessionStorage.setItem( 'ctimg', this.imgApiRes );
    // })

      // store reqestedData data in session storage.
      sessionStorage.setItem('sharedObject', JSON.stringify(reqestedData));
      if (this.leftCredits > 0) {
        this.showCreaditModal = false;
        this.itineraryService.getItineraryData(reqestedData).subscribe(
          (tripPlan: any) => {
            this.itineraryService.aiResponse.push(tripPlan?.tripPlan);

            // reduce creadits by 1 for each success itinerary.
            if (this.leftCredits > 0) {
              const updatedLeftCreadits = this.leftCredits - 1;

              // Update 'leftCreadits' in Firestore
              const referralDocRef = this.firestore
                .collection('users')
                .doc(this.userInfo.userId)
                .collection('referrals')
                .doc('referralDoc');
              referralDocRef.get().subscribe((res) => {
                const data = res.data();
                if (data) {
                  for (const key in data) {
                    if (Object.prototype.hasOwnProperty.call(data, key)) {
                      if (key === 'leftCredits') {
                        this.leftCredits = data[key];
                        this.updatedCredits = this.leftCredits - 1;
                        this.itineraryService.updatedCredits =
                          this.updatedCredits;
                      }
                      if (key === 'referredTo') {
                        const allRefree = data[key];
                        this.refereeList = allRefree;
                      }
                    }
                  }

                  const updatedObj = {
                    leftCredits: this.updatedCredits,
                    referredTo: this.refereeList,
                  };
                  // update object in DB
                  referralDocRef.update(updatedObj);
                }
              });
            } else {
              window.alert(
                'Your all creadits left you need to reffer to friend for get more credits !!!'
              );
            }

            this.loading = false;
            if (
              this.myForm.valid &&
              this.selectedActivities.length > 0 &&
              this.selectedCities.length > 0 &&
              this.selectedModeOfTravell !== ''
            ) {
              this.router.navigate(['/itinarary-details'], {
                queryParams: {
                  userId: tripPlan?.additionalDetails.user,
                  docId: tripPlan?.additionalDetails.docId,
                  selectCity: this.itineraryData.selectCity,
                },
              });
            }
          },
          (error) => {
            console.error('Error while generating trip plan:', error);
            this.loading = false;
            this.faildToGenerate = true;
            this.errorModalComponent.errorMessage =
              'An error occurred while generating trip plan. Please try again later.';
            this.errorModalComponent.openModal();
            if (this.errorModalComponent.showModal === false) {
              this.faildToGenerate = false;
            }
          }
        );
      } else {
        this.itineraryService.getRefrralCode(this.userInfo.userId).subscribe(
          (res) => {
            this.fetchingRefCode = false;
            this.loggedUserRefCode = res.refCode;
          },
          (error) => {
            this.fetchingRefCode = true;
            console.error(error);
          }
        );
        this.loading = false;
        this.faildToGenerate = true;
        this.showCreaditModal = true;
      }
    }

    this.myForm.get('selectCity')?.setValue('');
  }


  closeCreaditsModal() {
    this.showCreaditModal = false;
  }

  goToHowItWorks() {
    this.router.navigate(['/refrralDetrails']);
  }

  @ViewChild('candidateList') candidateList!: ElementRef;
  @ViewChild('cityList') cityList!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (
      this.candidateList &&
      !this.candidateList.nativeElement.contains(event.target)
    ) {
      this.listCandidate = false;
    }
    if (this.cityList && !this.cityList.nativeElement.contains(event.target)) {
      this.filteredCities.length = 0;
    }
  }

  selectModeOfTravel(mode: ModesOfTravelInterface): void {
    this.modesOfTravel.forEach((mode) => (mode.isSelected = false));
    mode.isSelected = !mode.isSelected;
    this.selectedModeOfTravell = mode.name;
    this.showReqTravelMode = false;
  }

  selectInterestActivity(activity: IntrestedActivitiesInterface): void {
    activity.isChoosed = !activity.isChoosed;
    if (activity.isChoosed) {
      this.selectedActivities.push(activity.name);
      this.showReqActivity = false;
    } else if (!activity.isChoosed) {
      const indexToRemove = this.selectedActivities.indexOf(activity.name);
      this.selectedActivities.splice(indexToRemove, 1);
    }
  }

  validateInput(): void {
    if (this.peopleCount < 1 || this.peopleCount > 50)
      this.isPeopleCountValid = false;
    this.isPeopleCountValid = true;
  }

  moneyInput() {
    if (this.moneyCount < 1 || this.moneyCount > 360)
      this.isMoneyCountValid = false;
    this.isMoneyCountValid = true;
  }

  selectCandidate(candidate: any) {
    this.selectedCandidate = candidate;
    this.listCandidate = false;
    this.unselectedCandidate = false;
  }

  travelCandidate: string[] = ['Friends', 'Couple', 'Family', 'Single'];

  onSearch() {
    this.filteredCities = this.indiaAllCitiList.filter((city) =>
      city.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onInputFocus() {
    this.showPromptMessage = !this.showPromptMessage;
  }

  showCandidate() {
    this.listCandidate = !this.listCandidate;
  }

  onInputBlur() {
    this.showPromptMessage = false;
  }

  onSelectCity(city: string) {
    if (this.selectedCities.includes(city)) {
      this.selectedCities = this.selectedCities.filter(
        (selectedCity) => selectedCity !== city
      );
    } else {
      this.selectedCities.push(city);
      this.showRequireCity = false;

      this.searchQuery = '';
    }
    this.filteredCities = [];
  }
  removeCity(index: number): void {
    this.selectedCities.splice(index, 1);
  }
}
function onDocumentClick(
  event: Event | undefined,
  Event: {
    new (type: string, eventInitDict?: EventInit | undefined): Event;
    prototype: Event;
    readonly NONE: 0;
    readonly CAPTURING_PHASE: 1;
    readonly AT_TARGET: 2;
    readonly BUBBLING_PHASE: 3;
  }
) {
  throw new Error('Function not implemented.');
}
