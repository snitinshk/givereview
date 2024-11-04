import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase-server';

export async function POST(request: Request) {

    try {

        const requestData = await request.json();
        const { client_name, client_type, client_logo, client_status } = requestData

        const { data, error } = await supabase
            .from('clients')
            .insert([
                { client_name, client_type, client_logo, client_status },
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
