import { Client, ClientDB } from "./clients";

export interface ReviewDetailDB {
    id: number;
    food_review: number | null;
    service_review: number | null;
    atmosphere_review: number | null;
    noise_review: number | null;
    price_review: number | null;
    cleanliness_review: number | null;
    wait_time_review: number | null;
    reviewers_name: string | null;
    reviewers_phone: string | null;
    reviewers_email: string | null;
    reviewers_place_experience: string | null;
    reviewers_visit_highlights: string | null;
    reviewers_visit_drawbacks: string | null;
    reviewers_other_comments: string | null;
    created_at: string;
    review_link_id: number;
    average_rating: number;
    client_id: number;
    clients?: ClientDB;
}

export interface ReviewDetailUI {
    id: number;
    foodReview: number | null;
    serviceReview: number | null;
    atmosphereReview: number | null;
    noiseReview: number | null;
    priceReview: number | null;
    cleanlinessReview: number | null;
    waitTimeReview: number | null;
    reviewersName: string | null;
    reviewersPhone: string | null;
    reviewersEmail: string | null;
    reviewersPlaceExperience: string | null;
    reviewersVisitHighlights: string | null;
    reviewersVisitDrawbacks: string | null;
    reviewersOtherComments: string | null;
    createdAt: string;
    reviewLinkId: number;
    averageRating: number;
    clientId: number;
    clients?: Client;
}


export interface TransformedReview {
    id: string;
    date: string;
    client: string;
    stars: number;
    name: string;
    review: string;
    image: string;
    foodReview: number | null;
    serviceReview: number | null;
    atmosphereReview: number | null;
    noiseReview: number | null;
    priceReview: number | null;
    cleanlinessReview: number | null;
    waitTimeReview: number | null;
    reviewerPhone: string | null;
    reviewerEmail: string | null;
    reviewerExperience: string | null;
    reviewerDrawbacks: string | null;
    reviewerComments: string | null;
    reviewLinkId: number;
    clientId: number;
}
