import { Component } from '@angular/core';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent {

  faq = [
    {
      question: "How do I earn credits?",
      answer: "Earn 5 credits upon registration and 5 more for each successful referral."
    },
    {
      question: "Can I save multiple itineraries?",
      answer: "Yes, you can save and access multiple itineraries."
    },
    {
      question: "Can I customize the generated itinerary?",
      answer: "Currently, the itinerary is AI-generated based on your preferences. However, we are working on a feature to allow users to customize their itineraries in the future."
    },
    {
      question: "How accurate are the estimated costs for accommodation and food?",
      answer: "The cost estimates are based on average prices and may vary. We recommend checking real-time prices and reviews for more accurate information."
    },
    {
      question: "What happens if I run out of credits and want to generate more itineraries?",
      answer: "If you run out of credits, you can earn more by referring friends. Alternatively, you can explore our premium membership options for unlimited itinerary generation."
    },
    {
      question: "How often are the destination details updated?",
      answer: "We strive to keep our information up-to-date. However, for the most accurate and real-time details, we recommend checking local sources and official websites."
    },
    {
      question: "Can I use Tripotale for business travel planning?",
      answer: "Currently, Tripotale is tailored for leisure travel. We are actively working on business travel features and plan to introduce them in future updates."
    },
    {
      question: "What happens if I dislike and regenerate my itinerary?",
      answer: "Disliking and regenerating an itinerary does not consume credits. Feel free to refine your preferences until you find the perfect plan for your trip."
    },
    {
      question: "Are my personal details and travel plans secure?",
      answer: "Yes, we prioritize the security and privacy of your data. Refer to our Privacy Policy for detailed information on how we handle user information."
    },
    {
      question: "How can I provide feedback or suggest improvements?",
      answer: "We value your feedback! Reach out to our support team or use the in-app feedback feature to share your thoughts and suggestions."
    }
  ];

  steps = [
    { step: 'Planning Your Trip', details: 'Begin by answering a series of simple questions about your travel preferences and details. Tell us if you are visiting multiple cities, the number of people, travel companions, budget per person, travel dates, preferred activities, and mode of transportation.'},
    { step: 'Generate Your Itinerary', details: 'Our AI processes your inputs to create a personalized itinerary, suggesting activities, restaurants, and more. Get daily plans for each city, along with detailed information about the destination'},
    { step: 'Credit System', details: 'New Users: Earn 5 credits upon registration. Generate Itineraries: Each generated itinerary costs 1 credit. Referral Program: Refer a friend and both get 5 additional credits.'},
    { step: 'Referral Program', details: 'Share your unique referral code with friends to earn more credits. Both you and your friend receive 5 credits upon successful registration.'},
    { step: 'Destination Details', details: 'Explore detailed information about each destination, including currency, temperature, language spoken, crowd status, and daily activities. Discover local cuisine, high-rated restaurants, and interesting trivia about the place.'},
    { step: 'Post-Generation Options', details: "Save, share, or print your itinerary for easy access. Dislike and regenerate without using credits if the recommendations don't meet your preferences."},
  ]
  
}
