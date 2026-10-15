import { motion } from "motion/react";
import { Heart, Github, Mail, CheckCircle2 } from "lucide-react";
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
    <footer className="relative border-t border-border px-4 py-16">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-neon-blue/5 blur-[100px]" />
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-neon-purple/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-2xl tracking-tight text-transparent">
              Eyoab Nigusie
            </h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Building innovative solutions with cutting-edge technology. Passionate about AI,
              mobile development, and creating exceptional user experiences.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/50 backdrop-blur-lg transition-all hover:border-neon-blue hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                  whileHover={{ scale: 1.1, y: -3 }}
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {Object.entries(links).map(([category, items], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h4 className="mb-4">{category}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.name}>
                    <motion.a
                      href={item.href}
                      download={item.download}
                      target={item.target}
                      rel={item.rel}
                      className="text-sm text-muted-foreground transition-colors hover:text-neon-cyan"
                      whileHover={{ x: 5 }}
                    >
                      {item.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="mb-4">Stay Updated</h4>
            <p className="mb-4 text-sm text-muted-foreground">
              Subscribe to get updates on new projects and articles.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 p-3 text-sm text-neon-cyan">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>Subscribed! Thank you for following my journey.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 rounded-lg border border-border bg-card/50 px-3 py-2 text-sm backdrop-blur-lg transition-all focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,212,255,0.2)] focus:outline-none"
                />
                <motion.button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-neon-blue to-neon-cyan px-4 py-2 text-sm font-medium text-background transition-all hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row"
        >
          <div className="flex items-center gap-1.5">
            <span>© 2026 Eyoab Nigusie. Built with modern web engineering</span>
            <Heart className="h-4 w-4 fill-neon-pink text-neon-pink inline" />
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/eyoabn" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-neon-cyan">
              GitHub
            </a>
            <a href="mailto:eyoabnigusie@gmail.com" className="transition-colors hover:text-neon-cyan">
              Email
            </a>
            <a href="#contact" className="transition-colors hover:text-neon-cyan">
              Get in Touch
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
