import { Component, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ItineraryService } from '../services/itinerary.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isLogedIn: any;
  leftCredits: number = 0;
  leftCreaditsDocId: string = '';
  userId: any = '';
  loading: boolean = false;
  loggedUserRefCode: any;
  showCreditsTooltip: boolean = false;

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private itineraryService: ItineraryService,
    private elementRef: ElementRef
  ) {
    this.toastr.toastrConfig.positionClass = 'toast-top-center';
    this.checkLogin();

    // Fetch creadits from DB
    this.userId = sessionStorage.getItem('userId');
    if (this.userId !== null) {
      const referralDocRef = this.firestore
        .collection('users')
        .doc(this.userId)
        .collection('referrals')
        .doc('referralDoc');
      referralDocRef.valueChanges().subscribe((data: any) => {
        if (data && 'leftCredits' in data) {
          this.leftCredits = data.leftCredits;
          sessionStorage.setItem('leftCredits', this.leftCredits.toString());
        }
      });
    } else {
      console.error('userId is null. Cannot fetch creadits.');
    }
  }

  checkLogin() {
    this.isLogedIn = sessionStorage.getItem('logedIn');
  }

  redirectTo(router: string) {
    this.router.navigate([router]);
  }

  onClickOnLogOut() {
    this.loading = true;
    sessionStorage.setItem('logedIn', 'false');
    this.checkLogin();
    sessionStorage.removeItem('userId');
    this.loading = false;
    this.toastr.success('Logged out successfully !');
    this.router.navigate(['']);
  }

  goToHome() {
    this.router.navigate(['']);
  }

  goToHelp() {
    this.router.navigate(['/help']);
  }

  goToRefDetails() {
    this.router.navigate(['/refrralDetrails']);
  }

  toggleCreditsTootip() {
    this.showCreditsTooltip = true;
  }
}
