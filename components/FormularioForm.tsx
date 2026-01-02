"use client";

import { type FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type TramiteType = "ciudadania" | "visa" | "tramites_consulares" | "otro";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
  tipo_tramite?: TramiteType;
  pais_residencia?: string;
  consulado_ciudad?: string;
  whatsapp_telefono?: string;
};

type ApiResponse =
  | { status: "done" }
  | { status: "fail"; error?: string }
  | { status?: string; error?: string };

function getApiError(data: ApiResponse | null) {
  if (!data) return undefined;
  return "error" in data ? data.error : undefined;
}

function isValidEmail(value: string) {
  // pragmatic validation; server does real checks too
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function FormularioForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [tipoTramite, setTipoTramite] = useState<TramiteType>("ciudadania");
  const [paisResidencia, setPaisResidencia] = useState("");
  const [consuladoCiudad, setConsuladoCiudad] = useState("");
  const [whatsappTelefono, setWhatsappTelefono] = useState("");

  const canSubmit = useMemo(() => {
    if (!name.trim()) return false;
    if (!email.trim() || !isValidEmail(email)) return false;
    if (!message.trim()) return false;
    return true;
  }, [email, message, name]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!canSubmit) {
      setError("Por favor completá nombre, email y mensaje.");
      return;
    }

    const payload: ContactPayload = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      tipo_tramite: tipoTramite,
      pais_residencia: paisResidencia.trim() || undefined,
      consulado_ciudad: consuladoCiudad.trim() || undefined,
      whatsapp_telefono: whatsappTelefono.trim() || undefined,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as ApiResponse | null;
      if (!res.ok) {
        throw new Error(getApiError(data) || "No se pudo enviar el mensaje.");
      }

      if (data && "status" in data && data.status !== "done") {
        throw new Error(getApiError(data) || "No se pudo enviar el mensaje.");
      }

      setName("");
      setEmail("");
      setMessage("");
      setPaisResidencia("");
      setConsuladoCiudad("");
      setWhatsappTelefono("");
      setTipoTramite("ciudadania");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 7000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo enviar el mensaje."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="form-label" htmlFor="name">
            Nombre y apellido <span className="text-red-700">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-input"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="form-label" htmlFor="email">
            Email <span className="text-red-700">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-input"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="form-label" htmlFor="whatsapp">
            WhatsApp / Teléfono (opcional)
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            className="form-input"
            autoComplete="tel"
            value={whatsappTelefono}
            onChange={(e) => setWhatsappTelefono(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="form-label" htmlFor="tipo_tramite">
            Tipo de trámite
          </label>
          <select
            id="tipo_tramite"
            name="tipo_tramite"
            className="form-select"
            value={tipoTramite}
            onChange={(e) => setTipoTramite(e.target.value as TramiteType)}
          >
            <option value="ciudadania">Ciudadanía</option>
            <option value="visa">Visa</option>
            <option value="tramites_consulares">Trámites consulares</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="form-label" htmlFor="pais_residencia">
            País de residencia
          </label>
          <input
            id="pais_residencia"
            name="pais_residencia"
            type="text"
            className="form-input"
            value={paisResidencia}
            onChange={(e) => setPaisResidencia(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="form-label" htmlFor="consulado_ciudad">
            Consulado / ciudad
          </label>
          <input
            id="consulado_ciudad"
            name="consulado_ciudad"
            type="text"
            className="form-input"
            value={consuladoCiudad}
            onChange={(e) => setConsuladoCiudad(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        <label className="form-label" htmlFor="message">
          Mensaje / Resumen del caso <span className="text-red-700">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={10}
          className="form-textarea"
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      {error ? (
        <p className="mt-4 text-sm text-cherryWood" role="alert">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mt-4 text-sm text-finn" role="status">
          ¡Gracias! Recibimos tu mensaje. Te vamos a responder a la brevedad.
        </p>
      ) : null}

      <div className="mt-6">
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </form>
  );
}
