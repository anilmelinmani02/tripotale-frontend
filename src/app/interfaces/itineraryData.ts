export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Activity {
    placeName: string;
    time: string;
    details: string;
    coordinates: Coordinates;
    cityName: string;
    imageUrl: string;
    meal: string;
    crowd: string;
}

export interface Location {
    cityName: string;
    coordinates: Coordinates;
}

export interface MoreAboutCity {
    cityImageUrl: string;
    currency: string;
    cityName: string;
    temperature: string;
    localLanguage: string;
    currencyExchangeRate: string;
}

export interface TripPlan {
    location: Location;
    dayDetail: string;
    activities: Activity[];
    moreAboutCity: MoreAboutCity;
}

export interface AccommodationCost {
    hostel: string;
    hotel: string;
}

export interface FoodCost {
    budget: string;
    fancyMeal: string;
}

export interface EstimatedBudget {
    accommodationCost: AccommodationCost;
    foodCost: FoodCost;
}

export interface LocalCuisine {
    name: string;
    comment: string;
}

export interface HighRatedRestaurant {
    name: string;
    comment: string;
}

export interface ShoulderMonthsCity {
    cityName: string;
    months: string;
    seasonsInfo: string;
}

export interface ShoulderMonths {
    cities: ShoulderMonthsCity[];
}

export interface MoreTripDetails {
    estimatedBudget: EstimatedBudget;
    localCuisine: LocalCuisine[];
    highRatedRestaurants: HighRatedRestaurant[];
    suggestions: string[];
    trivia: { question: string; answer: string }[];
    shoulderMonths: ShoulderMonths;
}

export interface UserTrip {
    tripPlans: TripPlan[];
    moreTripDetails: MoreTripDetails;
}

export interface itineraryData {
    userTrip: UserTrip;
}
