import { motion } from "motion/react";
import { Heart, Github, Linkedin, Twitter, Mail } from "lucide-react";

export function Footer() {
  const socialLinks = [
    { icon: Github, href: "https://github.com/eyoabn", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "mailto:eyoabnigusie@gmail.com", label: "Email" },
  ];

  const links = {
    Navigation: ["Home", "About", "Projects", "Skills", "Experience", "Contact"],
    Resources: ["Blog", "Resume", "GitHub", "LinkedIn"],
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
                  <li key={item}>
                    <motion.a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-neon-cyan"
                      whileHover={{ x: 5 }}
                    >
                      {item}
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
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-border bg-card/50 px-3 py-2 text-sm backdrop-blur-lg transition-all focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,212,255,0.2)] focus:outline-none"
              />
              <motion.button
                className="rounded-lg bg-gradient-to-r from-neon-blue to-neon-cyan px-4 py-2 text-sm transition-all hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
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
          <div className="flex items-center gap-1">
            <span>© 2026 Eyoab Nigusie. Made with</span>
            <Heart className="h-4 w-4 fill-neon-pink text-neon-pink" />
            <span>and lots of coffee</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="transition-colors hover:text-neon-cyan">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-neon-cyan">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
