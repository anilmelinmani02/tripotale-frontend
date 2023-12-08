import { Component } from '@angular/core'
import { NgModel } from '@angular/forms'

@Component({
  selector: 'app-customer-profiling',
  templateUrl: './customer-profiling.component.html',
  styleUrls: ['./customer-profiling.component.scss']
})
export class CustomerProfilingComponent {
  peopleCount: number = 1
  isPeopleCountValid: boolean = true
  isClicked = false
  searchTerm: string = ''
  filteredCities: string[] = []
  showPromptMessage: boolean = false
  searchQuery: string = ''
  selectedCities: string[] = []
  cityChips: any[] = []

  onClick() {
    this.isClicked = !this.isClicked
  }

  validateInput() {
    if (this.peopleCount < 1 || this.peopleCount > 50) this.isPeopleCountValid = false
    this.isPeopleCountValid = true
  }


  indianCitiesWithStates: string[] = [
    'Mumbai (MH)',
    'Delhi (DL)',
    'Bangalore (KA)',
    'Hyderabad (TL)',
    'Chennai (TN)',
    'Kolkata (WB)',
    'Ahmedabad (GJ)',
    'Pune (MH)',
    'Surat (GJ)',
    'Jaipur (Rj)',
    'Lucknow (UP)',
    'Kanpur (UP)',
    'Nagpur (MH)',
    'Indore (MP)',
    'Thane (MH)',
    'Bhopal (MP)',
    'Visakhapatnam (AP)',
    'Pimpri-Chinchwad (MH)',
    'Patna (BH)',
    'Vadodara (GJ)',
    // ... add more cities with states and country code as needed
  ]

  onSearch() {
    this.filteredCities = this.indianCitiesWithStates.filter(city => 
      city.toLowerCase().includes(this.searchQuery.toLowerCase()))
  }
  onInputFocus() {
    this.showPromptMessage = !this.showPromptMessage
  }
  onInputBlur() {
    this.showPromptMessage = false
  }
 
  onSelectCity(city: string) {
    if (this.selectedCities.includes(city)) {
      this.selectedCities = this.selectedCities.filter(selectedCity => selectedCity !== city)
    } else {
            
      this.selectedCities.push(city)
      console.log(this.selectedCities)

      //    #cityname only
      // const cityWords = city.split(/\s+/)
      // const cityOnly = cityWords[0]
      // this.selectedCities.push(cityOnly)
      
      this.searchQuery=''
    }
    this.filteredCities = []
  }
  removeCity(index: number): void {
    this.selectedCities.splice(index, 1)
  }
  
}
