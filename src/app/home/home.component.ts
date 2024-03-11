import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  journey: any;
  from: any;
  touched: boolean = false;

  constructor(private router: Router) {}

  onSubmit() {
    this.journey = { from: this.from };
    this.router.navigate(['/customer-profilling'], {
      queryParams: this.journey,
    });
  }
  
  onBlur() {
    this.touched = true;
  }

  onInput() {
    if (this.touched) {
      this.touched = false;
    }
  }
}
