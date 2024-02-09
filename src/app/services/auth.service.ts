import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  GoogleAuthProvider: any;
  auth: any;
  authToken : any;
  isVerified: any; 
  constructor( 
    private afu : AngularFireAuth,
    private router : Router,
    private toastr: ToastrService
    ) {
      this.toastr.toastrConfig.positionClass = 'toast-top-center';
     }

  register(email: string, password: string): Promise<boolean>  {
    return new Promise<boolean>((resolve, reject) => {
    this.afu.createUserWithEmailAndPassword(email,password)
    .then((res)=>{  
      this.toastr.success('Registration has been completed');
      res.user?.sendEmailVerification();
      console.log(res);
      // this.router.navigate(['/login']);
      resolve(true);
      
    })
    .catch((err) => {
      if (err.code === 'auth/email-already-in-use') {
        this.toastr.error('This email is already registered.');
      } else {
        this.toastr.error('Registration failed. Please try again later.');
      }
      console.error(err);
      resolve(false);
    })
    });
  }

  login(email: string, password: string) {
   return this.afu.signInWithEmailAndPassword(email, password);

  }

  googleSignIn() {
    return this.afu.signInWithPopup( new this.auth.GoogleAuthProvider());
  }
  logout() {
    return this.afu.signOut();
  }

  forgotPassword(email: string){
    this.afu.sendPasswordResetEmail(email).then(()=>{
      this.router.navigate(['/verify-email']);
      this.toastr.success('Password reset email sent successfully')
    }, err =>{
      this.toastr.error('Something went wrong, Please try again.');
    })
  }

  // isAuthenticated(){
  //   return localStorage.getItem(this.authToken)
  // }

  isAuthenticated() {
    return this.afu.authState.subscribe((res=>{
      console.log("is verified----", res?.emailVerified );
     this.isVerified = res?.emailVerified
    }))
  }
}
