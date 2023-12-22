import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registrationForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,private auth:AuthService) {

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
      console.log(this.registrationForm.value);
      this.auth.register(this.registrationForm.value.email, this.registrationForm.value.password)
    }
    
  }
  
  passwordMatchValidator(registrationForm: any) {
    const password = registrationForm.get('password').value;
    const confirmPassword = registrationForm.get('confirmPassword').value;

    return password === confirmPassword ? null : { mismatch: true };
  }

}
