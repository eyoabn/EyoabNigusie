import { motion } from "motion/react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "eyoabniguise@gmail.com",
      href: "mailto:alex@example.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+251967727865",
      href: "tel:+15551234567",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Ethiopia, Adama",
      href: "#",
    },
  ];

  return (
    <section id="contact" className="relative px-4 py-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 rounded-full bg-neon-blue/10 blur-[120px]" />
        <div className="absolute right-1/3 bottom-1/3 h-96 w-96 rounded-full bg-neon-purple/10 blur-[120px]" />
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
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card/50 p-4 backdrop-blur-lg transition-all hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
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
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full rounded-xl border border-border bg-card/50 px-4 py-3 backdrop-blur-lg transition-all focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,212,255,0.2)] focus:outline-none"
                  placeholder="Your name"
                  required
                />
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
                  className="w-full rounded-xl border border-border bg-card/50 px-4 py-3 backdrop-blur-lg transition-all focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,212,255,0.2)] focus:outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full rounded-xl border border-border bg-card/50 px-4 py-3 backdrop-blur-lg transition-all focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,212,255,0.2)] focus:outline-none"
                  placeholder="Your message..."
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-cyan px-8 py-3 transition-all hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Send Message</span>
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
