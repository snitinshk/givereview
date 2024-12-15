import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/supabase-server';

export async function GET(request: NextRequest) {

    try {

        const channelType = request.nextUrl.searchParams.get('type');

        const supabase = await createClient()

        const fetchChannelQuery = supabase
            .from('channels')
            .select('*');

        if (channelType) {
            fetchChannelQuery.eq('channel_type', channelType)
        }
        fetchChannelQuery.order('channel_name', { ascending: true })

        const { error, data: channels } = await fetchChannelQuery

        if (!error) {
            return NextResponse.json(channels, { status: 200 });

        } else {
            return NextResponse.json(
                { ...error },
                { status: 400 }
            );
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