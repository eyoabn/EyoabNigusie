import { motion } from "motion/react";
import { Mail, MapPin, Phone, Send, Check, AlertCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "../lib/utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Mirrors the server-side limits in backend/server.js so the visitor gets
// feedback instantly instead of a round trip and a generic error.
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

  // Bots fill in every field they can find; humans never see this one.
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

    // Only re-validate a field the visitor has already left once, so errors
    // don't appear while they're still typing their name for the first time.
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
      // Send focus to the first problem so keyboard and screen reader users
      // land on it instead of hunting for what went wrong.
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
      "w-full rounded-xl border bg-card/50 px-4 py-3 backdrop-blur-lg transition-all",
      "placeholder:text-muted-foreground/50",
      // A visible focus ring, not just a glow — keyboard users need to see where they are.
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      errors[field]
        ? "border-red-500/60 focus-visible:ring-red-500"
        : "border-border focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,212,255,0.2)] focus-visible:ring-neon-cyan"
    );

  const messageLength = formData.message.trim().length;

  return (
    <section id="contact" className="relative px-4 py-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 rounded-full bg-neon-blue/10 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 h-96 w-96 rounded-full bg-neon-purple/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-4xl tracking-tight text-transparent md:text-5xl">
            Get In Touch
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple" />
          <p className="mt-6 text-muted-foreground">
            Have a project in mind? Let's work together to create something amazing.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="mb-6 text-2xl">Let's Connect</h3>
              <p className="text-muted-foreground">
                I'm always interested in hearing about new projects and opportunities. Whether you
                have a question or just want to say hi, feel free to reach out!
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.label}
                  href={info.href}
                  {...(info.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card/50 p-4 backdrop-blur-lg transition-all hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20">
                    <info.icon className="h-5 w-5 text-neon-cyan" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{info.label}</div>
                    <div className="group-hover:text-neon-cyan">{info.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Honeypot — hidden from people, irresistible to bots. */}
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
                <label htmlFor="name" className="mb-2 block text-sm">
                  Name
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
                  placeholder="Your name"
                />
                {errors.name && (
                  <p id="name-error" className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm">
                  Email
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
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <label htmlFor="message" className="block text-sm">
                    Message
                  </label>
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      messageLength > LIMITS.message.max
                        ? "text-red-400"
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
                  rows={6}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={cn(fieldClasses("message"), "resize-y")}
                  placeholder="Your message..."
                />
                {errors.message && (
                  <p
                    id="message-error"
                    className="mt-2 flex items-center gap-1.5 text-sm text-red-400"
                  >
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {errors.message}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-cyan px-8 py-3 text-background transition-all hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
                whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
                whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
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
                  <Send
                    className={cn(
                      "h-4 w-4 transition-transform",
                      status === "loading" ? "animate-pulse" : "group-hover:translate-x-1"
                    )}
                  />
                )}
              </motion.button>

              {/* Announced to screen readers as it changes, without stealing focus. */}
              <p role="status" aria-live="polite" className="min-h-5 text-center text-sm">
                {status === "loading" && (
                  <span className="text-muted-foreground">Sending your message…</span>
                )}
                {status === "success" && (
                  <span className="text-green-400">
                    Thanks! Your message has been sent — I'll reply soon.
                  </span>
                )}
                {status === "error" && (
                  <span className="text-red-400">
                    Something went wrong. Please try again, or email me directly.
                  </span>
                )}
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
