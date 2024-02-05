import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email!: string;
  password!: string;
  myForm!:FormGroup

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
    ) {

    this.toastr.toastrConfig.positionClass = 'toast-top-center';
    this.myForm = this.fb.group({
      email:['',[Validators.required]],
      password:['',[Validators.required]]

    })
  }
  ngOnInit(){
    const isLoggedIn = localStorage.getItem('authToken')? true :false
    if(isLoggedIn){
      this.router.navigate(['/login'])
    }

  }

  login(){
    if(this.myForm.valid){
      this.auth.login(this.myForm.value.email, this.myForm.value.password).then(res =>{
        sessionStorage.setItem('logedIn', 'true');        
        sessionStorage.setItem('userId', this.myForm.value.email)
        // this.router.navigate(['/home']);
        if(res.user?.emailVerified == true){
          this.toastr.success('Logged in successfully.')
          this.router.navigate(['/home']);
        }else{
          this.toastr.error('Please verify your email before login')
        }
      })
    }

  }



}
