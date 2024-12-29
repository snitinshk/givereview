import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/supabase-server";
import { mapExternalReviewsToDb } from "@/mappers/reviews-mapper";
import { ExternalReviewDB } from "@/interfaces/reviews";
import { headers } from "next/headers";
import { BUCKET_NAME } from "@/constant";
import { getSlug, mediaUrl } from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


export async function OPTIONS() {
  // Handle preflight request
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest) {
  try {
    const clientId = request.nextUrl.searchParams.get("clientId");
    const conditionsJson = request.nextUrl.searchParams.get("conditions");
    const supabase = await createClient();

    if (!clientId) {
      return NextResponse.json(
        { error: "clientId is required" },
        { status: 400 }
      );
    }

    if (!conditionsJson) {
      return NextResponse.json(
        { error: "conditions are required" },
        { status: 400 }
      );
    }

    let externalReviews: any[] = [];
    const conditionsArr = JSON.parse(conditionsJson);

    // Validate parsed conditions
    if (!Array.isArray(conditionsArr)) {
      return NextResponse.json(
        { error: "Invalid conditions format" },
        { status: 400 }
      );
    }

    const queries = conditionsArr.map((condition: any) => {
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
        .eq("client_id", clientId)
        .gt("review_count", condition.ratingThreshold)
        .eq("channel_id", condition.channelId)
        .limit(condition.totalReviewsToDisplay);
    });

    const results = await Promise.all(
      queries.map(async (query) => {
        const { data, error } = await query;
        if (error) {
          throw new Error(`Query error: ${error.message}`);
        }
        return data;
      })
    );

    // Flatten results array
    externalReviews = results.flat();

    return NextResponse.json(externalReviews, { status: 200, headers: corsHeaders });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: NextRequest) {
  try {
    const securityToken = headers().get("token");

    // Check if the token is correct
    if (securityToken !== "reviewbooster-externalreviews") {
      return NextResponse.json(
        { error: "Invalid request, unauthorized access." },
        { status: 401 }
      );
    }

    const requestBody = await request.json();

    // Check for missing required fields
    const missingParams = requiredFields.filter((field) => !requestBody[field]);
    if (missingParams.length > 0) {
      const missingLabels = missingParams.map((field) => fieldLabels[field]);
      return NextResponse.json(
        { error: `Missing Params: ${missingLabels.join(", ")}` },
        { status: 400 }
      );
    }

    /**Handle Image upload to Supabase in case record is duplicate, don't upload in that case */

    const supabase = await createClient();

    const fileName = getSlug(
      `${requestBody.clientId}-${requestBody.reviewersName}-${requestBody.reviewDate}`
    );

    // Upload the reviewer avatar to Supabase Storage
    const { fileUrl, error } = await uploadExternalReviewToSupabase(
      requestBody.reviewersAvtar,
      fileName
    );
    if (error) {
      return NextResponse.json(
        { error: "Invalid Reviewers Avatar" },
        { status: 400 }
      );
    }

    const externalReview: ExternalReviewDB = mapExternalReviewsToDb({
      ...requestBody,
      fileUrl,
    });

    // Insert or update the external review in the database
    const { error: upsertErr } = await supabase.from("external_reviews").upsert(
      [
        externalReview, // Insert data
      ],
      {
        onConflict: "review_date, client_id, reviewers_name", // Unique columns
        ignoreDuplicates: true, // Ignore if the record already exists
      }
    );

    if (upsertErr) {
      return NextResponse.json({ error: upsertErr.message }, { status: 400 });
    }

    return NextResponse.json(
      { status: "Review successfully uploaded" },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function uploadExternalReviewToSupabase(
  imageUrl: string,
  fileName: string
) {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch the image");
    }

    // Convert image to Buffer
    const imageBuffer = Buffer.from(await response.arrayBuffer());

    const supabase = await createClient();

    const contentType = response.headers.get("content-type") as string;

    const fileType = getContentType(contentType);
    if (!fileType) {
      throw new Error(`Unsupported Reviewers Avatar: ${contentType}`);
    }

    const fullFileName = `widget/${fileName}.${fileType}`;

    // Upload to Supabase Storage
    const { data: uploadData, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fullFileName, imageBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    return { fileUrl: mediaUrl(uploadData?.fullPath as string), error: null };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unknown error during image upload",
    };
  }
}

const getContentType = (contentType: string): string | undefined => {
  const mimeToExtension: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
  };
  return mimeToExtension[contentType];
};

const requiredFields = [
  "clientId",
  "channelId",
  "reviewDate",
  "reviewCount",
  "reviewersName",
  "reviewersAvtar",
  "reviewTitle",
  "reviewDescription",
];

const fieldLabels = {
  clientId: "Client Id",
  channelId: "Channel Id",
  reviewDate: "Review Date",
  reviewCount: "Review Count",
  reviewersName: "Reviewer Name",
  reviewersAvtar: "Reviewer Avatar",
  reviewTitle: "Review Title",
  reviewDescription: "Review Description",
} as any;
