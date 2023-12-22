import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private citiesApi = 'http://localhost:8000/api/IND/states-cities';
  private apiUrl = 'http://localhost:8000/api/itineraryData';


  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient
  ) { }

  getItineraryData(selectedCity: string): Observable<any> {
    const requestData = { selectCity: [selectedCity] };
    return this.http.post<any>(this.apiUrl, requestData);
  }

  // get all indianCities
  getCitiesData(): Observable<any> {
    return this.http.get<any>(this.citiesApi);
  }

  // add form data to firestore
  addData(data: any): Promise<any> {
    return this.firestore.collection('itineraryData').add(data);
  }

  // get data from firestore
  getData(): Observable<any[]> {
    return this.firestore.collection('itineraryData').valueChanges();
  }
}
