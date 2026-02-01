import { useEffect, useMemo, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

/**
 * ContactForm
 * -----------
 * EmailJS contact form (client-only).
 *
 * Env vars (Vite):
 * - VITE_EMAILJS_SERVICE_ID
 * - VITE_EMAILJS_TEMPLATE_ID
 * - VITE_EMAILJS_PUBLIC_KEY
 *
 * Notes:
 * - Includes a honeypot field ("company") to reduce bot spam.
 * - Accessible validation (aria-invalid + aria-describedby).
 * - Auto-clears success/error messages after a short delay.
 */

const INITIAL_VALUES = Object.freeze({
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "", // honeypot
});

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v ?? "").trim());
}

function validate(values) {
  const e = {};

  if (!values.name.trim()) e.name = "Name is required.";
  if (!values.email.trim()) e.email = "Email is required.";
  else if (!isEmail(values.email)) e.email = "Enter a valid email address.";

  if (!values.subject.trim()) e.subject = "Subject is required.";

  if (!values.message.trim()) e.message = "Message is required.";
  else if (values.message.trim().length < 15) {
    e.message = "Message should be at least 15 characters.";
  }

  return e;
}

export default function ContactForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const statusTimerRef = useRef(null);
  const sending = status.state === "sending";

  const errors = useMemo(() => validate(values), [values]);
  const hasErrors = Object.keys(errors).length > 0;

  function clearStatusTimer() {
    if (statusTimerRef.current) {
      window.clearTimeout(statusTimerRef.current);
      statusTimerRef.current = null;
    }
  }

  function setTimedStatus(next) {
    clearStatusTimer();
    setStatus(next);

    // Auto-clear only success/error (not sending)
    if (next.state === "success" || next.state === "error") {
      statusTimerRef.current = window.setTimeout(() => {
        setStatus({ state: "idle", msg: "" });
        statusTimerRef.current = null;
      }, 4500);
    }
  }

  useEffect(() => {
    return () => {
      clearStatusTimer();
    };
  }, []);

  function markTouched(keys) {
    setTouched((prev) => {
      const next = { ...prev };
      for (const k of keys) next[k] = true;
      return next;
    });
  }

  function showError(key) {
    return !!touched[key] && !!errors[key];
  }

  function fieldAria(key) {
    const bad = showError(key);
    return {
      "aria-invalid": bad ? "true" : "false",
      "aria-describedby": bad ? `${key}-error` : undefined,
    };
  }

  function onChange(e) {
    const { name, value } = e.target;

    // Clear message when user edits
    if (status.state !== "idle") {
      clearStatusTimer();
      setStatus({ state: "idle", msg: "" });
    }

    setValues((p) => ({ ...p, [name]: value }));
  }

  function onBlur(e) {
    const key = e.target.name;
    setTouched((p) => ({ ...p, [key]: true }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    markTouched(["name", "email", "subject", "message"]);

    // Honeypot: if filled, pretend success (bots)
    if (values.company.trim()) {
      setTimedStatus({
        state: "success",
        msg: "Thanks! Your message was sent.",
      });
      setValues(INITIAL_VALUES);
      setTouched({});
      return;
    }

    if (hasErrors) {
      setTimedStatus({
        state: "error",
        msg: "Please fix the highlighted fields.",
      });
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setTimedStatus({
        state: "error",
        msg: "Missing EmailJS env vars. Add them to .env.local and restart the dev server.",
      });
      return;
    }

    try {
      setStatus({ state: "sending", msg: "Sending..." });

      await emailjs.send(
        serviceId,
        templateId,
        {
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
        },
        { publicKey },
      );

      setValues(INITIAL_VALUES);
      setTouched({});
      setTimedStatus({
        state: "success",
        msg: "Thanks! Your message was sent.",
      });
    } catch {
      setTimedStatus({
        state: "error",
        msg: "Failed to send. Please try again or contact me via email/LinkedIn.",
      });
    }
  }

  return (
    <form className="contactForm" onSubmit={onSubmit} noValidate>
      {/* Honeypot (hidden from humans) */}
      <div className="hpWrap" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          value={values.company}
          onChange={onChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="formRow">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="name"
            disabled={sending}
            {...fieldAria("name")}
          />
          {showError("name") ? (
            <div className="error" id="name-error" role="alert">
              {errors.name}
            </div>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="email"
            inputMode="email"
            disabled={sending}
            {...fieldAria("email")}
          />
          {showError("email") ? (
            <div className="error" id="email-error" role="alert">
              {errors.email}
            </div>
          ) : null}
        </div>
      </div>

      <div className="field">
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={values.subject}
          onChange={onChange}
          onBlur={onBlur}
          disabled={sending}
          {...fieldAria("subject")}
        />
        {showError("subject") ? (
          <div className="error" id="subject-error" role="alert">
            {errors.subject}
          </div>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={onChange}
          onBlur={onBlur}
          rows={6}
          disabled={sending}
          {...fieldAria("message")}
        />
        {showError("message") ? (
          <div className="error" id="message-error" role="alert">
            {errors.message}
          </div>
        ) : null}
      </div>

      <div className="formActions">
        <button className="btnPrimary" type="submit" disabled={sending}>
          {sending ? "Sending..." : "Send message"}
        </button>

        <div
          className={`formStatus ${status.state}`}
          role="status"
          aria-live="polite"
        >
          {status.msg}
        </div>
      </div>
    </form>
  );
}
