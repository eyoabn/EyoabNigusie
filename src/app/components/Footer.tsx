import { Github, Mail, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const socialLinks = [
    { icon: Github, href: "https://github.com/eyoabn", label: "GitHub", external: true },
    { icon: Mail, href: "mailto:eyoabnigusie@gmail.com", label: "Email", external: false },
  ];

  type FooterLink = {
    name: string;
    href: string;
    download?: string;
    target?: string;
    rel?: string;
  };

  const links: Record<string, FooterLink[]> = {
    Navigation: [
      { name: "Home", href: "#" },
      { name: "About", href: "#about" },
      { name: "Projects", href: "#projects" },
      { name: "Skills", href: "#skills" },
      { name: "Experience", href: "#experience" },
      { name: "Contact", href: "#contact" },
    ],
    Resources: [
      { name: "Resume (PDF)", href: "/resume.pdf", download: "Eyoab_Nigusie_Resume.pdf" },
      { name: "Interactive CV", href: "/resume.html", target: "_blank", rel: "noopener noreferrer" },
      { name: "GitHub Profile", href: "https://github.com/eyoabn", target: "_blank", rel: "noopener noreferrer" },
      { name: "Source Code", href: "https://github.com/eyoabn", target: "_blank", rel: "noopener noreferrer" },
    ],
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    toast.success("Thank you for subscribing! You'll be notified of new releases.");
    setNewsletterEmail("");
  };

  return (
    <footer className="relative border-t border-border/80 bg-card/40 px-6 py-16 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          
          {/* Brand & Summary (4 cols) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-xs font-bold text-foreground">
                EN
              </div>
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                Eyoab Nigusie
              </h3>
            </div>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Software engineering undergraduate at ASTU focusing on production-ready web platforms and Flutter mobile apps.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links (4 cols) */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-4">
            {Object.entries(links).map(([category, items]) => (
              <div key={category}>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {category}
                </h4>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        download={item.download}
                        target={item.target}
                        rel={item.rel}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Stay in Touch
            </h4>
            <p className="mb-4 text-sm text-muted-foreground">
              Subscribe to occasionally receive updates on new projects and articles.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Subscribed! Thank you for following along.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-border/80 bg-card px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-95 shrink-0 cursor-pointer"
                >
                  Join
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Eyoab Nigusie. Designed with craft & intent.</p>
          <div className="flex items-center gap-6">
            <span>Adama, Ethiopia</span>
            <span>•</span>
            <a href="#main" className="hover:text-foreground transition-colors">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
