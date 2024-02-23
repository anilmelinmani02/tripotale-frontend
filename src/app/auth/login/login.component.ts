import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email!: string;
  password!: string;
  myForm!: FormGroup;
  loading: boolean = false;

  @ViewChild('emailField', { static: false }) emailField!: ElementRef;
  @ViewChild('passwordField', { static: false }) passwordField!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.toastr.toastrConfig.positionClass = 'toast-top-center';
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit() {
    const isLoggedIn = localStorage.getItem('authToken') ? true : false;
    if (isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  login() {
    if (this.myForm.valid) {
      this.loading = true;
      this.auth
        .login(this.myForm.value.email, this.myForm.value.password)
        .then((res) => {
          sessionStorage.setItem('logedIn', 'true');
          sessionStorage.setItem('userId', this.myForm.value.email);
          if (res.user?.emailVerified == true) {
            this.loading = false;
            this.toastr.success('Logged in successfully.');
            this.router.navigate(['/home']);
          } else {
            this.toastr.error('Please verify your email before login');
            this.loading = false;
          }
        })
        .catch((error) => {
          this.loading = false;
          if (error.code == 'auth/invalid-credential') {
            this.toastr.error(
              'Oops! Incorrect password or email. Please try again.'
            );
          } else {
            if (error.code === 'auth/too-many-requests') {
              this.toastr.error(
                'Maximum failed attempts exceeded, Try again later.'
              );
            } else {
              this.toastr.error('An error occurred. Please try again later.');
            }
          }
        });
    } else {
      this.loading = false;
      if (this.myForm.get('email')?.invalid) {
        this.emailField.nativeElement.focus();
      }
      if (this.myForm.get('password')?.invalid) {
        this.passwordField.nativeElement.focus();
      }
      if (
        this.myForm.get('email')?.invalid &&
        this.myForm.get('password')?.invalid
      ) {
        this.emailField.nativeElement.focus();
      }
    }
  }
}
