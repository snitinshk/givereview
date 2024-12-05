import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/supabase-server';

export async function GET(request: NextRequest) {

    try {
        const reviewLinkSlug = request.nextUrl.searchParams.get('slug');

        const supabase = await createClient()

        const { error, data: clients } = await supabase
        .from('setting_review_link_details')
        .select(
          `
            *,
            clients!inner(*),
            negative_review_link_details!inner(*),
            thankyou_review_link_details(*),
            positive_review_link_details(*, channels!inner(channel_name, channel_logo_url))
          `
        )
        .eq('review_link_slug', reviewLinkSlug)
        .single();
      
      if (!error) {
        return NextResponse.json(clients, { status: 200 });
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

// You can also handle POST, PUT, DELETE, etc.
