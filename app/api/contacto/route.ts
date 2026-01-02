import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export type Fields = {
  name: string;
  message: string;
  email: string;
  tipo_tramite?: "ciudadania" | "visa" | "tramites_consulares" | "otro";
  pais_residencia?: string;
  consulado_ciudad?: string;
  whatsapp_telefono?: string;
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

export const POST = async (req: NextRequest) => {
  try {
    const request = (await req.json()) as Fields;
    const { name, email, message } = request;

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
