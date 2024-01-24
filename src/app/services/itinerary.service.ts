import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  baseUrl: string = `https://us-central1-tripotale-f1db9.cloudfunctions.net/api2/`;

   // Subject to emit tripPlan data
  tripPlanSource = new Subject<any>();
  tripPlan$ = this.tripPlanSource.asObservable();
  aiResponse: any[]=[];
  userRequestedData: any;
  leftCreadits: number = 5;

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

    return this.http.post<any>(`${this.baseUrl}getItineraryDetails`, userReqData, httpOptions)
  }

  getTripPlanObservable(): Observable<any> {
    return this.tripPlanSource.asObservable();
  }

  // get all indianCities
  getCitiesData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}IND/states-cities`);
  }

  // save-collection
  saveCollection(savingStatus:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}save-collection`,savingStatus)
  }

  updateCollectionSaveStatus(docId: string, userId: string, isSavedToCollection: boolean): Observable<any> {
    const body = { docId, userId, isSavedToCollection };
    return this.http.put(`${this.baseUrl}update-save-to-collection`, body);
  }

  // add form data to firestore

  // addData(data: any): Promise<any> {
  //   return this.firestore.collection('userRequest').add(data);
  // }

  // get data from firestore

  getFirestoreData(): Observable<any[]> {
    return this.firestore.collection('users').valueChanges();
  }
}
