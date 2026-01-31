import { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";

const INITIAL_VALUES = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "", // honeypot
};

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

export default function ContactForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const errors = useMemo(() => {
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
  }, [values]);

  const hasErrors = Object.keys(errors).length > 0;
  const isSending = status.state === "sending";

  function setField(name, value) {
    setValues((p) => ({ ...p, [name]: value }));
    // optional: clear status when user starts editing again
    if (status.state !== "idle") setStatus({ state: "idle", msg: "" });
  }

  function onChange(e) {
    const { name, value } = e.target;
    setField(name, value);
  }

  function onBlur(e) {
    const key = e.target.name;
    setTouched((p) => ({ ...p, [key]: true }));
  }

  function showError(key) {
    return !!touched[key] && !!errors[key];
  }

  function fieldAria(key) {
    const show = showError(key);
    return {
      "aria-invalid": show ? "true" : "false",
      "aria-describedby": show ? `${key}-error` : undefined,
    };
  }

  async function onSubmit(e) {
    e.preventDefault();

    setTouched({ name: true, email: true, subject: true, message: true });

    // Honeypot: bots fill it
    if (values.company.trim()) {
      setStatus({ state: "success", msg: "Thanks! Your message was sent." });
      setValues(INITIAL_VALUES);
      setTouched({});
      return;
    }

    if (hasErrors) {
      setStatus({ state: "error", msg: "Please fix the highlighted fields." });
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus({
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

      setStatus({ state: "success", msg: "Thanks! Your message was sent." });
      setValues(INITIAL_VALUES);
      setTouched({});
    } catch {
      setStatus({
        state: "error",
        msg: "Failed to send. Please try again or contact me via email/LinkedIn.",
      });
    }
  }

  return (
    <form className="contactForm" onSubmit={onSubmit} noValidate>
      {/* Honeypot */}
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
          <label className="fieldLabel" htmlFor="name">
            Name
          </label>
          <input
            className={`fieldInput ${showError("name") ? "invalid" : ""}`}
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="name"
            disabled={isSending}
            {...fieldAria("name")}
          />
          {showError("name") ? (
            <div className="fieldError" id="name-error" role="alert">
              {errors.name}
            </div>
          ) : null}
        </div>

        <div className="field">
          <label className="fieldLabel" htmlFor="email">
            Email
          </label>
          <input
            className={`fieldInput ${showError("email") ? "invalid" : ""}`}
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="email"
            inputMode="email"
            disabled={isSending}
            {...fieldAria("email")}
          />
          {showError("email") ? (
            <div className="fieldError" id="email-error" role="alert">
              {errors.email}
            </div>
          ) : null}
        </div>
      </div>

      <div className="field">
        <label className="fieldLabel" htmlFor="subject">
          Subject
        </label>
        <input
          className={`fieldInput ${showError("subject") ? "invalid" : ""}`}
          id="subject"
          name="subject"
          type="text"
          value={values.subject}
          onChange={onChange}
          onBlur={onBlur}
          disabled={isSending}
          {...fieldAria("subject")}
        />
        {showError("subject") ? (
          <div className="fieldError" id="subject-error" role="alert">
            {errors.subject}
          </div>
        ) : null}
      </div>

      <div className="field">
        <label className="fieldLabel" htmlFor="message">
          Message
        </label>
        <textarea
          className={`fieldInput fieldTextarea ${
            showError("message") ? "invalid" : ""
          }`}
          id="message"
          name="message"
          value={values.message}
          onChange={onChange}
          onBlur={onBlur}
          rows={6}
          disabled={isSending}
          {...fieldAria("message")}
        />
        {showError("message") ? (
          <div className="fieldError" id="message-error" role="alert">
            {errors.message}
          </div>
        ) : null}
      </div>

      <div className="formActions">
        <button className="btnPrimary" type="submit" disabled={isSending}>
          {isSending ? "Sending..." : "Send message"}
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
