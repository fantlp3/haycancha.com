import { directus } from "./directus";
import { createItem } from "@directus/sdk";
import type { ClubPendingSubmission } from "./directus-types";

export type SubmissionResult =
  | { success: true }
  | { success: false; error: string; details?: Record<string, string> };

/**
 * Submit a new club to the moderation queue.
 *
 * IMPORTANT — endpoint behavior:
 *   - On success, Directus returns 204 No Content (no body).
 *     The SDK resolves with empty data — DO NOT expect a created row back.
 *
 * Forbidden fields (will be rejected with 403): estado, club_creado,
 * ip_remitente, notas_admin, procesado_at.
 */
export async function submitClubPending(
  data: ClubPendingSubmission
): Promise<SubmissionResult> {
  try {
    await directus.request(createItem("clubes_pending", data as any));
    return { success: true };
  } catch (error: any) {
    console.error("[submitClubPending] error:", error);

    const status = error?.response?.status ?? 0;
    const errors = error?.errors ?? [];

    if (status === 422 && errors.length > 0) {
      const details: Record<string, string> = {};
      for (const err of errors) {
        const field = err.extensions?.field;
        const message = err.message;
        if (field) details[field] = message;
      }
      return {
        success: false,
        error: "Algunos campos no son válidos. Revisá el formulario.",
        details,
      };
    }

    if (status === 403) {
      return {
        success: false,
        error: "No se pudo enviar la solicitud. Verificá los campos.",
      };
    }

    return {
      success: false,
      error: "No se pudo enviar la solicitud. Intentá de nuevo en unos minutos.",
    };
  }
}
