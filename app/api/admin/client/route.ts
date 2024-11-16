import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/supabase-server';

export async function GET() {

    try {
        const supabase = await createClient()

        const {error, data: channels} = await supabase
        .from('clients')
        .select('*')
        .order('client_name', { ascending: true })

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
