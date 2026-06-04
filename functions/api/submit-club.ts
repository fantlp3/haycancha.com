/**
 * Cloudflare Pages Function — anti-spam gate for the "Agregá tu cancha" form.
 *
 * Flow:
 *   1. Receive { submission, turnstileToken } as JSON from the SPA.
 *   2. Verify the Turnstile token against Cloudflare siteverify
 *      (secret = TURNSTILE_SECRET_KEY, remoteip = CF-Connecting-IP).
 *   3. On success, forward the submission to Directus
 *      ({VITE_DIRECTUS_URL}/items/clubes_pending) as anonymous JSON.
 *      (Option B — Directus endpoint stays anonymous for now.)
 *   4. Map the Directus response back to the existing SubmissionResult
 *      contract used by src/lib/submissions.ts:
 *        - 204/200            → { success: true }
 *        - 422 + errors[]     → { success: false, error, details }
 *        - everything else    → generic failure
 */

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  VITE_DIRECTUS_URL?: string;
}

type SubmissionResult =
  | { success: true }
  | { success: false; error: string; details?: Record<string, string> };

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const DIRECTUS_FALLBACK = "https://api.haycancha.com";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let payload: { submission?: unknown; turnstileToken?: unknown };
  try {
    payload = await context.request.json();
  } catch {
    return json<SubmissionResult>(
      { success: false, error: "Solicitud inválida." },
      400
    );
  }

  const { submission, turnstileToken } = payload ?? {};
  if (!turnstileToken || typeof turnstileToken !== "string") {
    return json<SubmissionResult>(
      {
        success: false,
        error: "Falta la verificación anti-spam. Recargá la página e intentá de nuevo.",
      },
      400
    );
  }
  if (!submission || typeof submission !== "object") {
    return json<SubmissionResult>(
      { success: false, error: "Faltan datos del formulario." },
      400
    );
  }

  const secret = context.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return json<SubmissionResult>(
      { success: false, error: "Configuración del servidor incompleta." },
      500
    );
  }

  const remoteip = context.request.headers.get("CF-Connecting-IP") ?? "";

  const verifyForm = new FormData();
  verifyForm.append("secret", secret);
  verifyForm.append("response", turnstileToken);
  if (remoteip) verifyForm.append("remoteip", remoteip);

  let verifyOutcome: { success?: boolean } = {};
  try {
    const verifyRes = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body: verifyForm,
    });
    verifyOutcome = await verifyRes.json();
  } catch {
    return json<SubmissionResult>(
      {
        success: false,
        error: "No pudimos verificar que no seas un bot. Recargá la página e intentá de nuevo.",
      },
      403
    );
  }

  if (!verifyOutcome.success) {
    return json<SubmissionResult>(
      {
        success: false,
        error: "No pudimos verificar que no seas un bot. Recargá la página e intentá de nuevo.",
      },
      403
    );
  }

  const directusUrl = (context.env.VITE_DIRECTUS_URL ?? DIRECTUS_FALLBACK).replace(/\/$/, "");

  let directusRes: Response;
  try {
    directusRes = await fetch(`${directusUrl}/items/clubes_pending`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(submission),
    });
  } catch {
    return json<SubmissionResult>(
      {
        success: false,
        error: "No se pudo enviar la solicitud. Intentá de nuevo en unos minutos.",
      },
      502
    );
  }

  if (directusRes.status === 204 || directusRes.status === 200 || directusRes.status === 201) {
    return json<SubmissionResult>({ success: true }, 200);
  }

  if (directusRes.status === 422) {
    let body: { errors?: Array<{ message?: string; extensions?: { field?: string } }> } = {};
    try {
      body = await directusRes.json();
    } catch {
      // fall through to generic mapping below
    }
    const details: Record<string, string> = {};
    for (const err of body.errors ?? []) {
      const field = err.extensions?.field;
      if (field && err.message) details[field] = err.message;
    }
    return json<SubmissionResult>(
      {
        success: false,
        error: "Algunos campos no son válidos. Revisá el formulario.",
        details,
      },
      422
    );
  }

  if (directusRes.status === 403) {
    return json<SubmissionResult>(
      {
        success: false,
        error: "No se pudo enviar la solicitud. Verificá los campos.",
      },
      403
    );
  }

  return json<SubmissionResult>(
    {
      success: false,
      error: "No se pudo enviar la solicitud. Intentá de nuevo en unos minutos.",
    },
    502
  );
};
