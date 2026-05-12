import { directus } from "./directus";
import { createItem } from "@directus/sdk";

export type FeedbackTipo = "owner" | "visitor";

export interface FeedbackPayload {
  tipo: FeedbackTipo;
  club: string; // UUID
  nombre: string;
  email: string;
  mensaje: string;
}

export async function submitFeedback(payload: FeedbackPayload): Promise<void> {
  // Public role has create-only on clubes_feedback. Directus returns 204 No Content;
  // SDK handles that fine. estado defaults to "nuevo" on the backend.
  await directus.request(createItem("clubes_feedback" as any, payload as any));
}
