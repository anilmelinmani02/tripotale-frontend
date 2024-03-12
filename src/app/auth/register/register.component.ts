import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  checkProperRefCode:boolean=false
  referralCodeList: any[] = [];
  updatedCredits: number = 0;
  loader:boolean=false
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
    private activeRouter:ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.toastr.toastrConfig.positionClass = 'toast-top-center';
  }

  ngOnInit() {
   this.createForm()
   this.patchReFCode()
  }
  createForm(){
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
  patchReFCode(){
    this.loader=true
    this.firestore.collection('referralCodes').valueChanges()
      .subscribe((data: any) => {
        this.loader=false
        const refCodeList =Object.entries(data[0]).map(([email, code]) => ({ email, code }))
        this.activeRouter.queryParamMap.subscribe((res:any)=>{
          if (res.params.refCode){
            const findRefId = refCodeList.find((e:any)=>e.code ===res.params.refCode);
            if (findRefId){
              this.checkProperRefCode =true
              this.registrationForm.get('refferalCode')?.patchValue(findRefId.code)
            } else if (res.params.refCode && findRefId){
              this.checkProperRefCode =false;
            }
          } else{
            this.checkProperRefCode =true
          }
        })
      });
  }
  passwordMatchValidator(registrationForm: any) {
    const password = registrationForm.get('password').value;
    const confirmPassword = registrationForm.get('confirmPassword').value;

    return password === confirmPassword ? null : { mismatch: true };
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
            this.registerUserRefCode()
           
          } else {
            // Registration failed
            console.log('Failed to register ');
          }
        });
    } else {
      this.toastr.error('Please fill out all required fields.');
    }
  }
  registerUserRefCode(){
    this.registerWithoutRefcode()
    if (this.registrationForm.value.refferalCode){
      // 1st register user and add 5 credits to his account
       this.itineraryService.getUserId(this.registrationForm.value.refferalCode).subscribe((response) => {
      if(response.userId){
        this.firestore.collection('users').doc(response.userId).collection('referrals').doc('referralDoc').get().subscribe((res) => {
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
                  this. referralCodeList = allRefree;
                }
              }
            }
            this.referralCodeList.push({ referee: this.registrationForm.value.email, timestamp: new Date() });
            const updatedObj = {
              leftCredits: this.updatedCredits,
              referredTo: this.referralCodeList,
            };
            // add 5 credits and referee Id to referrer doc
            this.firestore.collection('users').doc(response.userId).collection('referrals').doc('referralDoc').update(updatedObj)
              .then(() => {
                console.log('Object updated successfully!');
              })
              .catch((error) => {
                console.error('Error updating object: ', error);
              });
          }
        });
      }
    });
      this.router.navigate(['/login']);
    }
  }
  registerWithoutRefcode() {
    // create a uniqe refCode in DB.
    this.firestore.doc('referralCodes/refDoc').set({ [this.registrationForm.value.email]: this.generateUniqueString() }, { merge: true })
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
    this.firestore.collection('users').doc(this.registrationForm.value.email).collection('referrals').doc('referralDoc').set(objToAdd).then((docRef) => {})
      .then(() => {
        console.log('Object 5 credits successfully!');
      })
      .catch((error) => {
        console.error('Error adding credits: ', error);
      });
  }
  generateUniqueString(): string {
    // Add additional random characters
    const additionalRandomCharacters = this.generateRandomCharacters(16);
    const timestamp = new Date().getTime();
    const uniqueString = `${additionalRandomCharacters}_${timestamp}`;
    return uniqueString;
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
  goReload(){
    this.router.navigate(['/register']);
  }
}
