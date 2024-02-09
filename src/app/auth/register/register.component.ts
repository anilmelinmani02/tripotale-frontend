import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ItineraryService } from 'src/app/services/itinerary.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registrationForm!: FormGroup;
  userId: string = '';
  giftedCreadits = { leftCreadits: 5 };
  userIds: string[] = [];
  refCode: string = '';
  refCodeDocId: string = '';
  refereeList: any[] = [];
  referrerId: string = '';
  oldCredits: number = 0;
  updatedCredits: number = 0;

  @ViewChild('emailField', { static: false }) emailField!: ElementRef;
  @ViewChild('passwordField', { static: false }) passwordField!: ElementRef;
  @ViewChild('confPasswordField', { static: false })
  confPasswordField!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private firestore: AngularFirestore,
    private itineraryService: ItineraryService,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.toastr.toastrConfig.positionClass = 'toast-top-center';
  }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        refferalCode: [''],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  onSubmit(): void {
    if (this.registrationForm.get('email')?.invalid) {
      this.emailField.nativeElement.focus();
    } else {
      if (this.registrationForm.get('password')?.invalid) {
        this.passwordField.nativeElement.focus();
      } else {
        if (this.registrationForm.get('confirmPassword')?.invalid) {
          this.confPasswordField.nativeElement.focus();
        } else {
          if (
            this.registrationForm.get('email')?.invalid ||
            this.registrationForm.get('password')?.invalid
          ) {
            this.emailField.nativeElement.focus();
          }
        }
      }
    }

    if (
      this.registrationForm.get('email')?.invalid &&
      this.registrationForm.get('password')?.invalid
    ) {
      this.emailField.nativeElement.focus();
    }

    if (this.registrationForm.valid) {
      this.auth
        .register(
          this.registrationForm.value.email,
          this.registrationForm.value.password
        )
        .then((success) => {
          if (success) {
            // register with refId if used
            if (this.registrationForm.value.refferalCode !== '') {
              this.registerUserWithRefCode(this.refCode);
              this.router.navigate(['/login']);
            } else {
              //  register without refCode
              this.registerWithoutRefcode();
              this.router.navigate(['/login']);
            }
          } else {
            // Registration failed
            console.log('Failed to register ');
          }
        });
    } else {
      this.toastr.error('Please fill out all required fields.');
    }
  }

  registerWithoutRefcode() {
    const uniqueString = this.generateUniqueString();
    this.userId = this.registrationForm.value.email;
    // create a uniqe refCode in DB.
    this.firestore
      .doc('referralCodes/refDoc')
      .set({ [this.userId]: uniqueString }, { merge: true })
      .then(() => {
        console.log('added new user with generated refCode');
      })
      .catch(() => {
        console.log('unable to add user and RefCode');
      })
      .catch((error) => {
        console.error('Error adding credits: ', error);
      });

    // add 5 credits to register user as a welcom gift
    const objToAdd = { leftCredits: 5 };
    this.firestore
      .collection('users')
      .doc(this.userId)
      .collection('referrals')
      .doc('referralDoc')
      .set(objToAdd)
      .then((docRef) => {})
      .then(() => {
        console.log('Object 5 credits successfully!');
      })
      .catch((error) => {
        console.error('Error adding credits: ', error);
      });
  }

  passwordMatchValidator(registrationForm: any) {
    const password = registrationForm.get('password').value;
    const confirmPassword = registrationForm.get('confirmPassword').value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  generateRandomCharacters(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  generateUniqueString(): string {
    // Add additional random characters
    const additionalRandomCharacters = this.generateRandomCharacters(16);
    const timestamp = new Date().getTime();
    const uniqueString = `${additionalRandomCharacters}_${timestamp}`;
    return uniqueString;
  }

  registerUserWithRefCode(refCode: string) {
    // 1st register user and add 5 credits to his account
    this.registerWithoutRefcode();

    this.itineraryService.getUserId(refCode).subscribe((response) => {
      console.log('User ID:', response.userId);

      this.referrerId = response.userId;

      // add 5 credits and referee Id to referrer doc
      const referralDocRef = this.firestore
        .collection('users')
        .doc(this.referrerId)
        .collection('referrals')
        .doc('referralDoc');
      referralDocRef.get().subscribe((res) => {
        const data = res.data();
        if (data) {
          for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              if (key === 'leftCredits') {
                const leftCredits = data[key];
                this.updatedCredits = leftCredits + 5;
                this.itineraryService.updatedCredits = this.updatedCredits;
              }

              if (key === 'referredTo') {
                const allRefree = data[key];
                this.refereeList = allRefree;
              }
            }
          }

          const referee = { referee: this.userId, timestamp: new Date() };
          this.refereeList.push(referee);

          const updatedObj = {
            leftCredits: this.updatedCredits,
            referredTo: this.refereeList,
          };

          referralDocRef
            .update(updatedObj)

            .then(() => {
              console.log('Object updated successfully!');
            })
            .catch((error) => {
              console.error('Error updating object: ', error);
            });
        }
      });
    });
  }

  // search UserId from refCOde

  // searchUserId(refCode: string) {
  //   if (this.registrationForm.get('refferalCode')?.value.length > 0) {
  //     this.itineraryService.getUserId(refCode).subscribe(
  //       response => {
  //         console.log('User ID:', response.userId);
  //       }
  //     )
  //   } else {
  //     console.log('Enter the referrel code');
  //   }
  // }
}
