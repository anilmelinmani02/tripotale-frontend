import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLogedIn: any;
  leftCreadits:any;
  constructor(private router:Router){
    this.leftCreadits = localStorage.getItem('remainingAttempt');
    console.log('left creadits', this.leftCreadits);
     this.checkLogin()
  }

  checkLogin(){
    this.isLogedIn = sessionStorage.getItem('logedIn'); 
    console.log(this.isLogedIn);
  }

  redirectTo(router:string) {
    this.router.navigate([router]);
  }
  onClickOnLogOut(){
    sessionStorage.setItem('logedIn','false');
    this.checkLogin();
    sessionStorage.removeItem('userId');
    this.router.navigate([''])
  }
}
