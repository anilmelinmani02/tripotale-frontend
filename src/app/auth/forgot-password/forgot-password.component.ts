import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPassword!: FormGroup;
  email!: string;

  constructor(private fb : FormBuilder, private auth:AuthService, private router : Router ) {

    this.forgotPassword = this.fb.group({
      email:['',[Validators.required]],

    })
   }

  ngOnInit() {
  }
  onSubmit() {
    this.auth.forgotPassword(this.email);
    this.email ='';
    this.router.navigate(['/login'])
    
  }
}
