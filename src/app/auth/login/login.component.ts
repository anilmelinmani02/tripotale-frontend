import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private fb:FormBuilder,private auth:AuthService ,private router:Router) {
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
        localStorage.setItem('logedIn', 'true');        
        localStorage.setItem('userId', this.myForm.value.email)
        this.router.navigate(['/home']);
        if(res.user?.emailVerified == true){
          this.router.navigate(['/home']);
        }
      })
    }

  }

}
