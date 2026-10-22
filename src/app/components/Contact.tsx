import { Mail, MapPin, Phone, Send, Check, AlertCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "../lib/utils";
import { API_URL } from "../lib/api";

const LIMITS = {
  name: { min: 2, max: 100 },
  message: { min: 10, max: 5000 },
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FieldName = "name" | "email" | "message";
type Errors = Partial<Record<FieldName, string>>;

function validateField(name: FieldName, value: string): string | undefined {
  const v = value.trim();
  switch (name) {
    case "name":
      if (v.length < LIMITS.name.min) return "Please enter at least 2 characters.";
      if (v.length > LIMITS.name.max) return "That name is too long.";
      return undefined;
    case "email":
      if (!v) return "An email address is required.";
      if (!EMAIL_RE.test(v)) return "That doesn't look like a valid email address.";
      return undefined;
    case "message":
      if (v.length < LIMITS.message.min) return "Please write at least 10 characters.";
      if (v.length > LIMITS.message.max) return "Please keep it under 5000 characters.";
      return undefined;
  }
}

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "eyoabnigusie@gmail.com",
    href: "mailto:eyoabnigusie@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+251967727865",
    href: "tel:+251967727865",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Adama, Ethiopia",
    href: "https://www.google.com/maps/search/?api=1&query=Adama%2C+Ethiopia",
    external: true,
  },
];

export function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const honeypotRef = useRef<HTMLInputElement>(null);

  const validateAll = (): Errors => {
    const next: Errors = {};
    (Object.keys(formData) as FieldName[]).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) next[field] = error;
    });
    return next;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const field = e.target.name as FieldName;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as FieldName;
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, e.target.value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const found = validateAll();
    setErrors(found);
    setTouched({ name: true, email: true, message: true });

    if (Object.keys(found).length > 0) {
      const firstBad = (Object.keys(found) as FieldName[])[0];
      document.getElementById(firstBad)?.focus();
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          website: honeypotRef.current?.value ?? "",
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || `Server responded with ${response.status}`);
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTouched({});
      setErrors({});
      toast.success("Message sent — I'll get back to you soon.");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
      toast.error(
        error instanceof Error ? error.message : "Failed to send message."
      );
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const fieldClasses = (field: FieldName) =>
    cn(
      "w-full rounded-xl border bg-card px-4 py-3 transition-colors",
      "placeholder:text-muted-foreground/60 text-foreground text-sm",
      "focus:outline-none focus:ring-2 focus:ring-primary/20",
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
        : "border-border/80 focus:border-primary"
    );

  const messageLength = formData.message.trim().length;

  return (
    <section id="contact" className="relative px-6 py-28 lg:px-12">
      <div className="mx-auto max-w-6xl">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Get In Touch
          </div>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Let's Start a Conversation
          </h2>
          <p className="mx-auto max-w-xl text-base text-muted-foreground">
            Have a project in mind, an engineering role open, or just want to chat tech? Send a message below.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-start">
          
          {/* Left Column: Direct Details (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
                Contact Information
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                I am responsive via email, phone, and GitHub. Feel free to connect regarding opportunities, collaborative projects, or software architecture questions.
              </p>
            </div>

            <div className="space-y-3">
              {contactInfo.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  {...(info.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs transition-colors hover:border-foreground/20"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <info.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">{info.label}</div>
                    <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {info.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/30 p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Current Availability
              </div>
              <p className="text-sm text-foreground">
                Open to full-time junior/mid software engineering roles, contract projects, and remote worldwide collaborations.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-sm lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              
              {/* Honeypot */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">Leave this field empty</label>
                <input
                  ref={honeypotRef}
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={fieldClasses("name")}
                  placeholder="e.g. John Doe"
                />
                {errors.name && (
                  <p id="name-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={fieldClasses("email")}
                  placeholder="name@company.com"
                />
                {errors.email && (
                  <p id="email-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Message
                  </label>
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      messageLength > LIMITS.message.max
                        ? "text-red-500"
                        : "text-muted-foreground/60"
                    )}
                  >
                    {messageLength}/{LIMITS.message.max}
                  </span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={5}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={cn(fieldClasses("message"), "resize-y")}
                  placeholder="Tell me about your project, timeline, or question..."
                />
                {errors.message && (
                  <p id="message-error" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <span>
                  {status === "loading"
                    ? "Sending..."
                    : status === "success"
                      ? "Message Sent!"
                      : "Send Message"}
                </span>
                {status === "success" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Send className={cn("h-4 w-4", status === "loading" && "animate-pulse")} />
                )}
              </button>

              <p role="status" aria-live="polite" className="min-h-5 text-center text-xs">
                {status === "loading" && (
                  <span className="text-muted-foreground">Sending your message...</span>
                )}
                {status === "success" && (
                  <span className="text-emerald-500 font-medium">
                    Thank you! Your message has been sent. I'll get back to you shortly.
                  </span>
                )}
                {status === "error" && (
                  <span className="text-red-500">
                    Something went wrong. Please try again or reach out directly at eyoabnigusie@gmail.com.
                  </span>
                )}
              </p>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
