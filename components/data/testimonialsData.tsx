import GLGIMG from "@/app/images/google.svg"
import TRIPIMG from "@/app/images/tripadvisor.svg"
import PLACEIMG from "@/app/images/placeholder.svg"

export interface Testimonial {
    id: number;
    author: string;
    date: string;
    rating: number;
    message: string;
    platform: string;
    platformImage?: string; 
    authorImage?: string; 
  }
  
  export const testimonials: Testimonial[] = [
    {
      id: 1,
      author: "Marko Silvén",
      authorImage: PLACEIMG,
      date: "15 October 2024",
      rating: 5,
      message:
        "Very nice! On the other hand, we denounce with righteous indignation and dislike men who are so beguiled.",
      platform: "Google",
      platformImage: GLGIMG,
    },
    {
      id: 2,
      author: "John Doe",
      authorImage: PLACEIMG,
      date: "20 October 2024",
      rating: 4,
      message: "Amazing experience! Highly recommend this place.",
      platform: "Tripadvisor",
      platformImage: TRIPIMG,
    },
    {
      id: 3,
      author: "Emily Stone",
      authorImage: PLACEIMG,
      date: "12 October 2024",
      rating: 5,
      message: "Fantastic service! The staff was extremely polite and helpful.",
      platform: "Google",
      platformImage: GLGIMG,
    },
    {
      id: 4,
      author: "Chris Evans",
      authorImage: PLACEIMG,
      date: "8 October 2024",
      rating: 3,
      message: "Good experience overall, but the wait time was longer than expected.",
      platform: "TheFork",
      platformImage: TRIPIMG,
    },
    {
      id: 5,
      author: "Sophia Lopez",
      authorImage: PLACEIMG,
      date: "5 October 2024",
      rating: 4,
      message: "A wonderful ambiance, perfect for family dinners!",
      platform: "Tripadvisor",
      platformImage: TRIPIMG,
    },
    {
      id: 6,
      author: "Liam Jackson",
      authorImage: PLACEIMG,
      date: "3 October 2024",
      rating: 5,
      message: "The food was absolutely delicious! Will definitely come back again.",
      platform: "Google",
      platformImage: GLGIMG,
    },
    {
      id: 7,
      author: "Olivia Brown",
      authorImage: PLACEIMG,
      date: "1 October 2024",
      rating: 4,
      message: "Great location and amazing views from the terrace seating!",
      platform: "TheFork",
      platformImage: TRIPIMG,
    },
    {
      id: 8,
      author: "Noah Wilson",
      authorImage: PLACEIMG,
      date: "30 September 2024",
      rating: 5,
      message: "Everything was perfect, from the appetizers to the desserts.",
      platform: "Tripadvisor",
      platformImage: GLGIMG,
    },
  ];
  