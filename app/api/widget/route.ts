import { createClient } from "@/lib/supabase/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const widgetId = request.nextUrl.searchParams.get("uuid");

    const supabase = await createClient();

    const { error, data: widget } = await supabase
      .from("widgets")
      .select(
        ` *,
            widget_channels(*, channels!inner(channel_name, channel_logo_url))
          `
      )
      .eq("widget_uuid", widgetId)
      .maybeSingle();

    if (!error) {

      const fetchConditions = widget?.widget_channels
        ?.filter((channel: any) => channel?.is_active)
        ?.map((channel: any) => ({
          channelId: channel.channel_id,
          ratingThreshold: channel.rating_threshold,
          totalReviewsToDisplay: widget?.total_reviews_to_display,
        }));

      const queries = fetchConditions.map((condition: any) => {
        if (
          !condition.channelId ||
          !condition.ratingThreshold ||
          !condition.totalReviewsToDisplay
        ) {
          throw new Error(
            "Invalid condition format. Must include channelId, ratingThreshold, and totalReviewsToDisplay."
          );
        }

        return supabase
          .from("external_reviews")
          .select("*, clients(client_name), channels(*)")
          .eq("client_id", widget?.client_id)
          .gt("review_count", condition.ratingThreshold)
          .eq("channel_id", condition.channelId)
          .order('review_date', { ascending: false })
          .limit(condition.totalReviewsToDisplay);
          
      });

      const results = await Promise.all(
        queries.map(async (query: any) => {
          const { data, error } = await query;
          if (error) {
            throw new Error(`Query error: ${error.message}`);
          }
          return data;
        })
      );

      // Flatten results array
      const externalReviews = results.flat();

      return NextResponse.json({ widget, externalReviews }, { status: 200 });
    } else {
      return NextResponse.json({ ...error }, { status: 400 });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
