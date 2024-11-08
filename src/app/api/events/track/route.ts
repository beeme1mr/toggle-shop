"use server";

import { sendTrackEvent } from "@/libs/open-feature/send-tracking-event";

export async function POST(request: Request) {
  const attributes = await request.json();

  sendTrackEvent(attributes);
  return new Response(null, { status: 202 });
}
