import type { ClubPendingSubmission } from "./directus-types";

export type SubmissionResult =
  | { success: true }
  | { success: false; error: string; details?: Record<string, string> };

/**
 * Submit a new club to the moderation queue via the Pages Function
 * (functions/api/submit-club.ts), which verifies a Cloudflare Turnstile
 * token before forwarding to Directus's clubes_pending collection.
 *
 * The Function returns the SubmissionResult contract as JSON, so this
 * wrapper only handles network/parse failures.
 */
export async function submitClubPending(
  data: ClubPendingSubmission,
  turnstileToken: string
): Promise<SubmissionResult> {
  try {
    const res = await fetch("/api/submit-club", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ submission: data, turnstileToken }),
    });

    let body: SubmissionResult | null = null;
    try {
      body = (await res.json()) as SubmissionResult;
    } catch {
      // Response without a JSON body — treat as generic failure below.
    }

    if (body && (body.success === true || body.success === false)) {
      return body;
    }

    return {
      success: false,
      error: "No se pudo enviar la solicitud. Intentá de nuevo en unos minutos.",
    };
  } catch (error) {
    console.error("[submitClubPending] network error:", error);
    return {
      success: false,
      error: "No se pudo enviar la solicitud. Intentá de nuevo en unos minutos.",
    };
  }
}
