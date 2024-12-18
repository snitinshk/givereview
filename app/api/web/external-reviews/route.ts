import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/supabase-server';
import { mapExternalReviewsToDb } from '@/mappers/reviews-mapper';
import { ExternalReviewDB } from '@/interfaces/i-reviews';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
    try {

        const stream = request.nextUrl.searchParams.get('streamName');
        const supabase = await createClient()
        const externalReviewQuery = supabase.from('external_reviews')
            .select('*,channels(*)');
        if (stream) {
            externalReviewQuery.eq('stream_name', stream)
        }
        const { data: externalReviews, error } = await externalReviewQuery
        if (!error) {
            return NextResponse.json(externalReviews, { status: 200 });
        } else {
            return NextResponse.json({ ...error }, { status: 400 });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }

}

export async function POST(request: NextRequest) {

    try {
        //   const requestData = await request.formData();
        const securityToken = headers().get('token');
        if (securityToken !== 'reviewbooster-externalreviews') {
            throw Error(`Invalid request`);
        }
        const requestBody = await request.json();

        const missingParams = requiredFields.filter(field => !requestBody[field]);

        if (missingParams.length > 0) {
            const missingLabels = missingParams.map(field => fieldLabels[field]);
            throw Error(`Missing Params: ${missingLabels.join(", ")}`);
        }

        const externalReview: ExternalReviewDB = mapExternalReviewsToDb(requestBody)

        const supabase = await createClient()

        const { error: upsertErr } = await supabase
            .from('external_reviews')
            .upsert([
                externalReview, // Insert data
            ], {
                onConflict: 'review_date,stream_name,reviewers_name', // Unique columns
                ignoreDuplicates: true, // Ignore if the record already exists
            });

        if (!upsertErr) {
            return NextResponse.json({ status: 200 });
        } else {
            return NextResponse.json({ ...upsertErr }, { status: 400 });
        }


    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

const requiredFields = [
    "streamName", "reviewSourceId", "reviewDate", "reviewCount",
    "reviewersName", "reviewersAvtar", "reviewTitle", "reviewDescription"
];

const fieldLabels = {
    streamName: "Stream Name",
    reviewSourceId: "Source Id",
    reviewDate: "Review Date",
    reviewCount: "Review Count",
    reviewersName: "Reviewer Name",
    reviewersAvtar: "Reviewer Avatar",
    reviewTitle: "Review Title",
    reviewDescription: "Review Description"
} as any;

// You can also handle POST, PUT, DELETE, etc.