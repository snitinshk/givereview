import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/supabase-server';


export async function GET(request: NextRequest) {

  try {
    const clientId = request.nextUrl.searchParams.get('client');

    const supabase = await createClient()

    const { error, data: widget } = await supabase
      .from('widgets')
      .select(
        ` *,
            widget_channels(*, channels!inner(channel_name, channel_logo_url))
          `
      )
      .eq('client_id', clientId)
      .maybeSingle();

    if (!error) {
      return NextResponse.json(widget, { status: 200 });
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
