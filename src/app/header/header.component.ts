import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLogedIn: any;
  constructor(private router:Router){
   this.isLogedIn = localStorage.getItem('logedIn'); 
   console.log(this.isLogedIn);
     
  }
  redirectTo(router:string) {
    this.router.navigate([router]);
  }
  onClickOnLogOut(){
    localStorage.setItem('logedIn','false');
    localStorage.removeItem('userId');
    this.router.navigate([''])
  }
}
