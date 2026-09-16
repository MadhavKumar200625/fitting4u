"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Mail, Store } from "lucide-react";

const initialForm = {
  boutiqueName: "",
  contactName: "",
  email: "",
  phone: "",
  city: "",
  website: "",
  message: "",
};

export default function PartnerWithUsPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setStatus({ type: "", message: "" });
  };

  const submitEnquiry = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/partner-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message);
      setForm(initialForm);
      setStatus({ type: "success", message: "Thanks. We have emailed you a confirmation and will be in touch soon." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc] pb-24 pt-32 text-[#003466]">
      <section className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-center">
          <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#ffc1cc]"><Store size={27} /></div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#c12d58]">Partner with Fitting4U</p>
          <h1 className="max-w-xl text-5xl font-bold leading-tight md:text-7xl">Let&apos;s grow your boutique together.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            Join a growing network of boutiques using Fitting4U to connect
            customers with beautiful fabrics, accurate measurements, and
            thoughtful tailoring experiences.
          </p>
          <div className="mt-9 space-y-4 text-slate-700">
            {["A trusted digital presence for your boutique", "Better discovery for your collections", "A team that works alongside your business"].map((item) => (
              <div key={item} className="flex items-center gap-3"><CheckCircle2 size={20} className="shrink-0 text-[#c12d58]" /><span>{item}</span></div>
            ))}
          </div>
          <a href="mailto:support@fitting4u.com" className="mt-10 inline-flex items-center gap-2 font-semibold text-[#003466]"><Mail size={18} /> support@fitting4u.com</a>
        </div>

        <form onSubmit={submitEnquiry} className="border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(0,52,102,0.1)] sm:p-10">
          <div className="mb-8"><h2 className="text-3xl font-bold">Tell us about your boutique</h2><p className="mt-2 text-slate-500">Share a few details and our partnership team will reach out.</p></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Boutique name" name="boutiqueName" value={form.boutiqueName} onChange={updateField} required />
            <Field label="Your name" name="contactName" value={form.contactName} onChange={updateField} required />
            <Field label="Email address" name="email" type="email" value={form.email} onChange={updateField} required />
            <Field label="Phone number" name="phone" type="tel" value={form.phone} onChange={updateField} required />
            <Field label="City" name="city" value={form.city} onChange={updateField} required />
            <Field label="Website or Instagram" name="website" value={form.website} onChange={updateField} />
          </div>
          <label className="mt-5 block text-sm font-semibold text-slate-700">How can we work together?
            <textarea name="message" value={form.message} onChange={updateField} rows={5} placeholder="Tell us about your boutique and what you are looking for..." className="mt-2 w-full resize-none border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#003466] focus:ring-2 focus:ring-[#ffc1cc]" />
          </label>
          {status.message && <p className={`mt-5 flex items-start gap-2 text-sm ${status.type === "success" ? "text-green-700" : "text-red-600"}`}><CheckCircle2 size={18} className="mt-0.5 shrink-0" />{status.message}</p>}
          <button type="submit" disabled={submitting} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#003466] px-6 py-4 font-semibold text-white shadow-lg disabled:cursor-wait disabled:opacity-60">{submitting ? "Sending enquiry..." : "Send partnership enquiry"} {!submitting && <ArrowRight size={19} />}</button>
          <p className="mt-4 text-center text-xs text-slate-400">We&apos;ll send a copy of your enquiry to your email.</p>
        </form>
      </section>
    </main>
  );
}

function Field({ label, name, type = "text", value, onChange, required = false }) {
  return <label className="block text-sm font-semibold text-slate-700">{label}{required && <span className="text-[#c12d58]"> *</span>}<input name={name} type={type} value={value} onChange={onChange} required={required} className="mt-2 w-full border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#003466] focus:ring-2 focus:ring-[#ffc1cc]" /></label>;
}