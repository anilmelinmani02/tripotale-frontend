import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  GoogleAuthProvider: any;
  auth: any;
  authToken: any;
  isVerified: any;
  constructor(
    private afu: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.toastr.toastrConfig.positionClass = 'toast-top-center';
  }

  register(email: string, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.afu
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          this.toastr.success('Congratulations! Your registration is complete.');
          res.user?.sendEmailVerification();
          resolve(true);
        })
        .catch((err) => {
          if (err.code === 'auth/email-already-in-use') {
            this.toastr.error('Oops! Looks like that email is already registered. Please log in or try a different email..');
          } else {
            this.toastr.error('Registration failed. Please try again later.');
          }
          console.error(err);
          resolve(false);
        });
    });
  }

  login(email: string, password: string) {
    return this.afu.signInWithEmailAndPassword(email, password);
  }

  googleSignIn() {
    return this.afu.signInWithPopup(new this.auth.GoogleAuthProvider());
  }
  logout() {
    return this.afu.signOut();
  }

  forgotPassword(email: string) {
    this.afu.sendPasswordResetEmail(email).then(
      () => {
        this.router.navigate(['/verify-email']);
        this.toastr.success("Password reset email sent. Check your inbox for instructions.");
      },
      (err) => {
        this.toastr.error('Something went wrong, Please try again.');
      }
    );
  }

  isAuthenticated() {
    return this.afu.authState.subscribe((res) => {
      this.isVerified = res?.emailVerified;
    });
  }
}
