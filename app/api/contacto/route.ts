import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

// Minimum time (ms) between form load and submit to consider it human
const MIN_SUBMIT_TIME_MS = 2000;

export type Fields = {
  name: string;
  message: string;
  email: string;
  tipo_tramite?: "ciudadania" | "visa" | "tramites_consulares" | "otro";
  pais_residencia?: string;
  consulado_ciudad?: string;
  whatsapp_telefono?: string;
  // Anti-spam fields
  turnstileToken?: string;
  hp?: string;
  startedAt?: number;
};

export type Response = {
  error?: string;
  status?: "done" | "fail";
  message?: string;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: requiredEnv("EMAIL_ADDRESS"),
    pass: requiredEnv("EMAIL_PASSWORD"),
  },
});

function safeLine(label: string, value?: string) {
  const v = value?.trim();
  if (!v) return "";
  return `${label}: ${v}\n`;
}

/**
 * Verify Turnstile token with Cloudflare
 */
async function verifyTurnstile(
  token: string,
  ip?: string | null
): Promise<{ success: boolean; errorCodes?: string[] }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // If no secret configured, skip verification (dev mode)
    console.warn("TURNSTILE_SECRET_KEY not set, skipping verification");
    return { success: true };
  }

  const formData = new URLSearchParams();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip) {
    formData.append("remoteip", ip);
  }

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  const data = (await res.json()) as {
    success: boolean;
    "error-codes"?: string[];
  };

  return {
    success: data.success,
    errorCodes: data["error-codes"],
  };
}

export const POST = async (req: NextRequest) => {
  try {
    const request = (await req.json()) as Fields;
    const { name, email, message, turnstileToken, hp, startedAt } = request;

    // --- Anti-spam checks ---

    // 1. Honeypot check: if filled, it's a bot
    if (hp) {
      // Silently reject (don't give bots hints)
      return NextResponse.json<Response>(
        { status: "fail", error: "No se pudo enviar el mensaje." },
        { status: 400 }
      );
    }

    // 2. Time check: reject if submitted too fast (likely bot)
    if (startedAt) {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_SUBMIT_TIME_MS) {
        return NextResponse.json<Response>(
          { status: "fail", error: "Por favor espere un momento antes de enviar." },
          { status: 400 }
        );
      }
    }

    // 3. Turnstile verification (if token provided)
    const hasTurnstileSecret = Boolean(process.env.TURNSTILE_SECRET_KEY);
    if (hasTurnstileSecret) {
      if (!turnstileToken) {
        return NextResponse.json<Response>(
          { status: "fail", error: "Por favor complete la verificación de seguridad." },
          { status: 400 }
        );
      }

      // Get client IP for Turnstile (optional but recommended)
      const ip =
        req.headers.get("CF-Connecting-IP") ||
        req.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
        null;

      const verification = await verifyTurnstile(turnstileToken, ip);
      if (!verification.success) {
        console.error("Turnstile verification failed:", verification.errorCodes);
        return NextResponse.json<Response>(
          { status: "fail", error: "No se pudo verificar la seguridad. Por favor intente de nuevo." },
          { status: 400 }
        );
      }
    }

    // --- End anti-spam checks ---

    if (!name || !name.trim()) {
      throw new Error("Por favor ingrese un nombre valido.");
    }

    if (!email || !email.trim()) {
      throw new Error("Por favor ingrese una direccion de correo valida.");
    }

    if (!message || !message.trim()) {
      throw new Error("Por favor ingrese un mensaje.");
    }

    const to = requiredEnv("EMAIL_ADDRESS");
    const from = to; // best practice for Gmail deliverability
    const replyTo = email.trim();

    const text =
      `${message.trim()}\n\n` +
      `---\n` +
      safeLine("Nombre", name) +
      safeLine("Email", email) +
      safeLine("WhatsApp / Teléfono", request.whatsapp_telefono) +
      safeLine("Tipo de trámite", request.tipo_tramite) +
      safeLine("País de residencia", request.pais_residencia) +
      safeLine("Consulado / ciudad", request.consulado_ciudad);

    const htmlMessage = message.trim().replace(/(?:\r\n|\r|\n)/g, "<br>");

    const html = `
      <p>${htmlMessage}</p>
      <hr />
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${
        request.whatsapp_telefono?.trim()
          ? `<p><strong>WhatsApp / Teléfono:</strong> ${request.whatsapp_telefono}</p>`
          : ""
      }
      ${
        request.tipo_tramite?.trim()
          ? `<p><strong>Tipo de trámite:</strong> ${request.tipo_tramite}</p>`
          : ""
      }
      ${
        request.pais_residencia?.trim()
          ? `<p><strong>País de residencia:</strong> ${request.pais_residencia}</p>`
          : ""
      }
      ${
        request.consulado_ciudad?.trim()
          ? `<p><strong>Consulado / ciudad:</strong> ${request.consulado_ciudad}</p>`
          : ""
      }
    `;

    await transporter.sendMail({
      to,
      from,
      replyTo,
      subject: `Un mensaje de ${name.trim()}`,
      text,
      html,
    });

    return NextResponse.json<Response>({ status: "done" });
  } catch (error) {
    return NextResponse.json<Response>(
      {
        status: "fail",
        error: error instanceof Error ? error.message : `${error}`,
      },
      { status: 400 }
    );
  }
};
