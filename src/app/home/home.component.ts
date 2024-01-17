import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  searchForm: FormGroup;
  journey:any;
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    ) {
      
      this.minDate = this.formatDate(new Date())

    this.searchForm = this.fb.group({
      from: ['', Validators.required],
      to: [''],
      date: ['',Validators.required]
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    this.journey = this.searchForm.value
    console.log('journey:', this.journey );
    this.router.navigate(['/customer-profilling'], {queryParams: this.journey})
  }
}
