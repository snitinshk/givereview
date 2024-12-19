import { ExternalReviewDB, ExternalReviewRequest, ReviewDetailDB, TransformedReview } from "@/interfaces/i-reviews";

export function mapReviews(inputData: ReviewDetailDB[]): TransformedReview[] {
    return inputData.map((item) => ({
        id: item.id.toString(), // Convert ID to string
        date: new Date(item.created_at).toISOString().split("T")[0], // Format date
        client: item.clients?.client_name || "Unknown", // Client name fallback
        stars: item.average_rating, // Average rating
        name: item.reviewers_name || "Anonymous", // Reviewer name fallback
        review:
            item.reviewers_visit_drawbacks || "No review provided.", // Default review text if empty
        image: item.clients?.client_logo || "", // Client logo
        foodReview: item.food_review ?? null, // Food review
        serviceReview: item.service_review ?? null, // Service review
        atmosphereReview: item.atmosphere_review ?? null, // Atmosphere review
        noiseReview: item.noise_review ?? null, // Noise review
        priceReview: item.price_review ?? null, // Price review
        cleanlinessReview: item.cleanliness_review ?? null, // Cleanliness review
        waitTimeReview: item.wait_time_review ?? null, // Wait time review
        reviewerPhone: item.reviewers_phone || null, // Reviewer phone
        reviewerEmail: item.reviewers_email || null, // Reviewer email
        reviewerExperience: item.reviewers_place_experience || null, // Reviewer experience
        reviewerHighlights: item.reviewers_visit_highlights || null, // Reviewer drawbacks
        reviewerComments: item.reviewers_other_comments || null, // Reviewer other comments
        reviewLinkId: item.review_link_id, // Review link ID
        clientId: item.client_id, // Client ID
    }));
}

export const mapExternalReviewsToDb = (source: ExternalReviewRequest) => {
    return {
        stream_name: source.streamName,
        review_source_id: source.reviewSourceId,
        review_date: source.reviewDate,
        review_count: source.reviewCount,
        reviewers_name: source.reviewersName,
        reviewers_avtar: source.reviewersAvtar,
        review_title: source.reviewTitle,
        review_description: source.reviewDescription,
    }
}

export const mapExternalReviewsToUI = (source: ExternalReviewDB) => {
    return {
        streamName: source.stream_name,
        source: source.review_source_id,
        reviewDate: source.review_date,
        stars: source.review_count,
        name: source.reviewers_name,
        reviewersAvtar: source.reviewers_avtar,
        reviewTitle: source.review_title,
        reviewDescription: source.review_description,
    }
}