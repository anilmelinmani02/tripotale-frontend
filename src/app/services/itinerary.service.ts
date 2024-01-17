import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  baseUrl: string = `https://us-central1-tripotale-f1db9.cloudfunctions.net/api2/`;

  private commentApi = 'http://localhost:8000/api/comments'
   // Subject to emit tripPlan data
  tripPlanSource = new Subject<any>();
  tripPlan$ = this.tripPlanSource.asObservable();
  aiResponse: any[]=[];
  userRequestedData: any;

  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient
  ) { }

  getItineraryData(userReqData: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      timeout: 600000,
    };

    // Make the HTTP request and tap into the response to emit tripPlan data
    // return this.http.post<any>(`${this.baseUrl}getItineraryDetails`, userReqData, httpOptions)
    //   .pipe(
    //     tap(tripPlan => this.tripPlanSource.next(tripPlan)),
    //     catchError(error => {
    //       console.error('Error while generating trip plan:', error);
    //       throw error;
    //     })
    //   );
    return this.http.post<any>(`${this.baseUrl}getItineraryDetails`, userReqData, httpOptions)
  }

  getTripPlanObservable(): Observable<any> {
    return this.tripPlanSource.asObservable();
  }

  // comment data
  getCommentsData(): Observable<any> {
    return this.http.get<any>(this.commentApi);
  }

  // get all indianCities
  getCitiesData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}IND/states-cities`);
  }

  // add form data to firestore
  addData(data: any): Promise<any> {
    return this.firestore.collection('userRequest').add(data);
  }

  // get data from firestore

  // getData(): Observable<any[]> {
  //   return this.firestore.collection('itineraryData').valueChanges();
  // }
}
