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
 *   4. On a successful Directus write, fire two transactional emails via
 *      Resend (admin notification + submitter confirmation). Email sending
 *      is BEST-EFFORT: it runs via context.waitUntil() with Promise.allSettled
 *      so a failure of either email is logged but never affects the
 *      SubmissionResult returned to the client.
 *   5. Map the Directus response back to the SubmissionResult contract used
 *      by src/lib/submissions.ts:
 *        - 204/200/201        → { success: true }
 *        - 422 + errors[]     → { success: false, error, details }
 *        - everything else    → generic failure
 */

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  VITE_DIRECTUS_URL?: string;
  RESEND_API_KEY?: string;
}

type SubmissionResult =
  | { success: true }
  | { success: false; error: string; details?: Record<string, string> };

interface SubmissionPayload {
  nombre?: string;
  tipo?: string;
  direccion?: string;
  pais_texto?: string;
  ciudad_texto?: string;
  barrio_texto?: string;
  nombre_remitente?: string;
  email_remitente?: string;
  telefono?: string;
  website?: string;
  deportes_indicados?: string[];
  cantidad_canchas?: number;
  notas_remitente?: string;
}

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const DIRECTUS_FALLBACK = "https://api.haycancha.com";
const RESEND_API_URL = "https://api.resend.com/emails";
const EMAIL_FROM = "HayCancha <noreply@send.haycancha.com>";
const ADMIN_TO = "haycancha.online@gmail.com";

const SPORT_LABEL: Record<string, string> = {
  tenis: "Tenis",
  padel: "Pádel",
  pickleball: "Pickleball",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const escapeHtml = (raw: string): string =>
  raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Render a multi-line plain-text block (e.g. notas_remitente) as safe HTML. */
const multilineHtml = (raw: string): string =>
  raw
    .split("\n")
    .map((line) => escapeHtml(line))
    .join("<br>");

const formatUbicacion = (s: SubmissionPayload): string => {
  const parts = [s.pais_texto, s.ciudad_texto, s.barrio_texto].filter(Boolean) as string[];
  return parts.length > 0 ? parts.join(" · ") : "—";
};

const formatDeportes = (s: SubmissionPayload): string => {
  const slugs = s.deportes_indicados ?? [];
  if (slugs.length === 0) return "—";
  const labelled = slugs.map((slug) => SPORT_LABEL[slug] ?? slug).join(", ");
  return s.cantidad_canchas
    ? `${labelled} — ${s.cantidad_canchas} cancha${s.cantidad_canchas === 1 ? "" : "s"} en total`
    : labelled;
};

const buildAdminHtml = (s: SubmissionPayload): string => {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:6px 0;color:#111;">${value}</td></tr>`;

  const notasBlock = s.notas_remitente
    ? `<h3 style="font-size:14px;margin:24px 0 8px;color:#111;">Notas del remitente</h3>
       <div style="font-size:13px;line-height:1.55;color:#333;background:#f7f7f7;border-left:3px solid #E8632A;padding:12px 14px;border-radius:4px;">${multilineHtml(s.notas_remitente)}</div>`
    : "";

  return `<!doctype html><html lang="es"><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#fff;color:#111;padding:24px;max-width:640px;margin:0 auto;">
<h2 style="font-size:18px;margin:0 0 4px;">Nueva solicitud de alta</h2>
<p style="font-size:13px;color:#666;margin:0 0 20px;">Llegó una nueva carga al moderador de <strong>clubes_pending</strong>.</p>
<table style="border-collapse:collapse;font-size:14px;width:100%;">
${row("Complejo", escapeHtml(s.nombre ?? "—"))}
${row("Tipo", escapeHtml(s.tipo ?? "—"))}
${row("Ubicación", escapeHtml(formatUbicacion(s)))}
${row("Dirección", escapeHtml(s.direccion ?? "—"))}
${row("Deportes", escapeHtml(formatDeportes(s)))}
${row("Remitente", escapeHtml(s.nombre_remitente ?? "—"))}
${row("Email", s.email_remitente ? `<a href="mailto:${escapeHtml(s.email_remitente)}" style="color:#E8632A;">${escapeHtml(s.email_remitente)}</a>` : "—")}
${row("Teléfono", escapeHtml(s.telefono ?? "—"))}
${s.website ? row("Sitio web", `<a href="${escapeHtml(s.website)}" style="color:#E8632A;">${escapeHtml(s.website)}</a>`) : ""}
</table>
${notasBlock}
<p style="font-size:12px;color:#999;margin-top:28px;">Revisá la solicitud en el panel de Directus para aprobarla o rechazarla.</p>
</body></html>`;
};

const buildSubmitterHtml = (s: SubmissionPayload): string => {
  const clubName = s.nombre ?? "tu complejo";
  return `<!doctype html><html lang="es"><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#fff;color:#111;padding:24px;max-width:600px;margin:0 auto;line-height:1.55;font-size:15px;">
<h2 style="font-size:20px;margin:0 0 12px;color:#E8632A;">Recibimos tu solicitud</h2>
<p style="margin:0 0 12px;">¡Gracias por sumar <strong>${escapeHtml(clubName)}</strong> a HayCancha!</p>
<p style="margin:0 0 12px;">Nuestro equipo va a revisar los datos en las próximas 48 horas hábiles. Te avisamos por este mismo email cuando el complejo esté publicado en el directorio.</p>
<p style="margin:0 0 12px;">Mientras tanto, si querés agregar fotos, corregir algún dato o tenés cualquier consulta, escribinos a <a href="mailto:haycancha.online@gmail.com" style="color:#E8632A;">haycancha.online@gmail.com</a>.</p>
<p style="margin:24px 0 0;">Un saludo,<br><strong>Equipo HayCancha</strong></p>
<hr style="border:none;border-top:1px solid #eee;margin:28px 0 12px;">
<p style="font-size:12px;color:#999;margin:0;">Este es un mensaje automático. Podés responder o escribirnos a haycancha.online@gmail.com para cualquier consulta.</p>
</body></html>`;
};

async function sendResendEmail(
  apiKey: string,
  payload: { from: string; to: string; subject: string; html: string }
): Promise<void> {
  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend returned ${res.status}: ${text.slice(0, 300)}`);
  }
}

/**
 * Fire admin + submitter emails in parallel. Best-effort: any failure is
 * logged but never thrown. Returns void; the caller does not await the
 * result (it is scheduled via context.waitUntil).
 */
async function fireBestEffortEmails(
  apiKey: string | undefined,
  submission: SubmissionPayload
): Promise<void> {
  if (!apiKey) {
    console.warn("[submit-club] RESEND_API_KEY not set — skipping email notifications.");
    return;
  }

  const tasks: Promise<void>[] = [];

  tasks.push(
    sendResendEmail(apiKey, {
      from: EMAIL_FROM,
      to: ADMIN_TO,
      subject: `Nueva solicitud de alta — ${submission.nombre ?? "sin nombre"}`,
      html: buildAdminHtml(submission),
    })
  );

  if (submission.email_remitente) {
    tasks.push(
      sendResendEmail(apiKey, {
        from: EMAIL_FROM,
        to: submission.email_remitente,
        subject: "Recibimos tu solicitud en HayCancha",
        html: buildSubmitterHtml(submission),
      })
    );
  } else {
    console.warn("[submit-club] submission has no email_remitente — skipping submitter confirmation.");
  }

  const results = await Promise.allSettled(tasks);
  for (const [i, r] of results.entries()) {
    if (r.status === "rejected") {
      const which = i === 0 ? "admin" : "submitter";
      console.error(`[submit-club] Resend ${which} email failed:`, r.reason);
    }
  }
}

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
    // Fire emails best-effort: scheduled via waitUntil so the user gets the
    // success response immediately and the Worker keeps running until both
    // Resend requests resolve (or fail). NEVER throws back to this scope.
    context.waitUntil(
      fireBestEffortEmails(context.env.RESEND_API_KEY, submission as SubmissionPayload).catch(
        (err) => console.error("[submit-club] unexpected email dispatch error:", err)
      )
    );
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
