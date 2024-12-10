import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/supabase-server';

export async function GET(request: NextRequest) {
    try {
        // Create Supabase client
        const supabase = await createClient();

        // Retrieve clientId from query parameters
        const clientId = request.nextUrl.searchParams.get('clientId');
        // const detailType = request.nextUrl.searchParams.get('detailType');

        if (!clientId) {
            return NextResponse.json(
                { error: 'Missing or invalid clientId' },
                { status: 400 }
            );
        }

        const query = `setting_review_link_details(id)`;

        // Query the database
        const { data: reviewLinkDetail, error } = await supabase.from('setting_review_link_details')
            .select(query)
            .eq('client_id', clientId)
            .single(); // Use `.single()` if you expect exactly one result

        if (error) {
            // Return specific error details
            return NextResponse.json(
                { error: error.message || 'Failed to fetch review link details' },
                { status: 400 }
            );
        }

        return NextResponse.json(reviewLinkDetail, { status: 200 });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}