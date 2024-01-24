import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registrationForm!: FormGroup;
  userId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private auth:AuthService,
    private firestore: AngularFirestore,
    ) {

   }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  onSubmit():void {
    if(this.registrationForm.valid){
      const uniqueString = this.generateUniqueString(this.registrationForm.value.email);
      sessionStorage.setItem('loginIdentifier', uniqueString);
      console.log("uid", uniqueString);
      // console.log(this.registrationForm.value);
       this.userId = this.registrationForm.value.email
       this.firestore.collection('referralCodes').doc(this.userId).set({ code: uniqueString });
       this.auth.register(this.registrationForm.value.email, this.registrationForm.value.password)
    }
  }
  
  passwordMatchValidator(registrationForm: any) {
    const password = registrationForm.get('password').value;
    const confirmPassword = registrationForm.get('confirmPassword').value;

    return password === confirmPassword ? null : { mismatch: true };
  }


  generateRandomCharacters(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }
  
  generateUniqueString(email: string): string {
    // Add additional random characters
    const additionalRandomCharacters = this.generateRandomCharacters(5);
  
    const timestamp = new Date().getTime();
    const uniqueString = `${email}_${timestamp}_${additionalRandomCharacters}`;
    return uniqueString;
  }

}
