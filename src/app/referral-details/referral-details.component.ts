import { Component } from '@angular/core';
import { ItineraryService } from '../services/itinerary.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-referral-details',
  templateUrl: './referral-details.component.html',
  styleUrls: ['./referral-details.component.scss'],
})
export class ReferralDetailsComponent {
  userId: any;
  loggedUserRefCode: string = '';
  leftCredits: any;
  allRefree: any[] = [];
  loading: boolean = false;
  fetchingRefCode: boolean = true;

  constructor(
    private itineraryService: ItineraryService,
    private firestore: AngularFirestore,
    private toastr: ToastrService
  ) {
    this.toastr.toastrConfig.positionClass = 'toast-top-center';

    this.leftCredits = sessionStorage.getItem('leftCredits');
    this.userId = sessionStorage.getItem('userId');
    // getting refcode
    this.itineraryService.getRefrralCode(this.userId).subscribe(
      (res) => {
        this.loggedUserRefCode = res.refCode;
        this.fetchingRefCode = false;
      },
      (error) => {
        console.error(error);
        this.fetchingRefCode = true;
      }
    );

    // get all referee's list
    this.loading = true;
    const referralDocRef = this.firestore
      .collection('users')
      .doc(this.userId)
      .collection('referrals')
      .doc('referralDoc');
    referralDocRef.get().subscribe(
      (res) => {
        this.loading = false;
        const data = res.data();
        if (data) {
          for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              if (key === 'referredTo') {
                this.allRefree = data[key];
              }
            }
          }
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  copyRefCode() {
    const copyUrl=
    navigator.clipboard
      .writeText(`${environment.depolyUrl}/register?refCode=${this.loggedUserRefCode}`)
      .then(() => {
        this.toastr.success('Referral link copied. Share with a friend!', '', {});
      })
      .catch((err) => {
        this.toastr.error('Error in copying text to clipboard');
        console.error('Error in copying text to clipboard: ', err);
      });
  }
}
