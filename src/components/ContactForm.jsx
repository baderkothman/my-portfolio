import React, { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "",
  });

  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const errors = useMemo(() => {
    const e = {};
    if (!values.name.trim()) e.name = "Name is required.";
    if (!values.email.trim()) e.email = "Email is required.";
    else if (!isEmail(values.email)) e.email = "Enter a valid email address.";
    if (!values.subject.trim()) e.subject = "Subject is required.";
    if (!values.message.trim()) e.message = "Message is required.";
    else if (values.message.trim().length < 15)
      e.message = "Message should be at least 15 characters.";
    return e;
  }, [values]);

  const hasErrors = Object.keys(errors).length > 0;

  function onChange(e) {
    const { name, value } = e.target;
    setValues((p) => ({ ...p, [name]: value }));
  }

  function onBlur(e) {
    setTouched((p) => ({ ...p, [e.target.name]: true }));
  }

  function fieldProps(key) {
    const show = !!touched[key] && !!errors[key];
    return {
      "aria-invalid": show ? "true" : "false",
      "aria-describedby": show ? `${key}-error` : undefined,
    };
  }

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });

    if (values.company.trim()) {
      setStatus({ state: "success", msg: "Thanks! Your message was sent." });
      setValues({ name: "", email: "", subject: "", message: "", company: "" });
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
      setValues({ name: "", email: "", subject: "", message: "", company: "" });
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
      <div
        style={{ position: "absolute", left: "-9999px", top: "auto" }}
        aria-hidden="true"
      >
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
            {...fieldProps("name")}
          />
          {touched.name && errors.name ? (
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
            {...fieldProps("email")}
          />
          {touched.email && errors.email ? (
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
          {...fieldProps("subject")}
        />
        {touched.subject && errors.subject ? (
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
          {...fieldProps("message")}
        />
        {touched.message && errors.message ? (
          <div className="error" id="message-error" role="alert">
            {errors.message}
          </div>
        ) : null}
      </div>

      <div className="formActions">
        <button
          className="btnPrimary"
          type="submit"
          disabled={status.state === "sending"}
        >
          {status.state === "sending" ? "Sending..." : "Send message"}
        </button>

        <div className="formStatus" role="status" aria-live="polite">
          {status.msg}
        </div>
      </div>
    </form>
  );
}
