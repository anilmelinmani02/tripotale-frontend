import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  GoogleAuthProvider: any;
  auth: any;
  authTocken : any; 
  constructor( private afu : AngularFireAuth, private router : Router) { }

  register(email: string, password: string) {
    this.afu.createUserWithEmailAndPassword(email,password).then((res)=>{  
      alert('registertion Successfully ....!');
      res.user?.sendEmailVerification();
      alert('please verify  your email');
      console.log(res)
      
      this.router.navigate(['/login']);
    }),(err: { message: any; }) =>{
      alert(err.message);
      this.router.navigate(['/register'])
    }
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
      alert('Email send Successful');
    }, err =>{
      alert('something went wrong')
    })
  }
  isAuthenticated(){
    return localStorage.getItem(this.authTocken)
  }
}
