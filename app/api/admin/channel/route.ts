import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {

    try {
        // const cookieStore = cookies();
        const requestData = await request.json();
        // const access_token = cookieStore.has('access_token');

        const { data, error } = await supabase
        .from('channels')
        .insert([
            requestData,
        ])
        .select()

        if (error) {
            return NextResponse.json(
                { ...error },
                { status: 400 }
            );
        } else {

            return NextResponse.json('Ok', { status: 200 });
        }

    } catch (error) {
        return NextResponse.json(
            { status: 500 }
        );
    }
}

// You can also handle POST, PUT, DELETE, etc.
