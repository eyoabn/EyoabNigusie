import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Mail, Calendar, Trash2, RefreshCw, MessageSquare, User, Clock, ArrowLeft, AlertCircle, CheckCircle, Loader2, Eye } from "lucide-react";

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function Admin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Authentication States
  const [password, setPassword] = useState(localStorage.getItem("admin_password") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [inputPassword, setInputPassword] = useState("");

  // Ensure dark mode and normal cursor on admin page
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.style.cursor = "auto";
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  const fetchMessages = async (pass?: string) => {
    setLoading(true);
    setError(null);
    const passToUse = pass !== undefined ? pass : password;
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        headers: {
          'x-admin-password': passToUse
        }
      });
      
      if (res.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem("admin_password");
        throw new Error("UNAUTHORIZED");
      }
      
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      setMessages(data);
      
      if (passToUse) {
        setIsAuthenticated(true);
        localStorage.setItem("admin_password", passToUse);
        setPassword(passToUse);
      } else {
        // If password is empty but server returned 200, it means no ADMIN_PASSWORD is set on the backend.
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED") {
        setError("Invalid admin password.");
      } else {
        setError(err.message || "Could not connect to the backend server. Make sure it is running.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedPass = localStorage.getItem("admin_password") || "";
      try {
        await fetchMessages(storedPass);
      } catch (err: any) {
        if (err.message !== "UNAUTHORIZED") {
          setIsAuthenticated(!!storedPass);
        }
      } finally {
        setCheckingAuth(false);
      }
    };
    initAuth();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/contact/${id}`, {
        method: "DELETE",
        headers: {
          'x-admin-password': password
        }
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem("admin_password");
        alert("Session expired. Please log in again.");
        return;
      }
      if (!res.ok) throw new Error("Delete failed");
      setMessages((prev) => prev.filter((m) => m._id !== id));
      setDeleteId(null);
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } catch {
      alert("Failed to delete message.");
    } finally {
      setDeleting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await fetchMessages(inputPassword);
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED") {
        setLoginError("Incorrect password. Please try again.");
      } else {
        setLoginError("Failed to connect. Check your server or internet connection.");
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4 font-sans">
        <Loader2 className="h-10 w-10 animate-spin text-neon-cyan" />
        <p className="text-muted-foreground text-sm">Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 font-sans relative">
        {/* Animated background glow */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-neon-blue/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-neon-purple/5 blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Top Border Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-blue to-neon-purple" />
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent mb-2">
              Admin Portal
            </h2>
            <p className="text-sm text-muted-foreground">
              Please enter your admin password to access the messages dashboard.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-neon-cyan/50 focus:outline-none focus:ring-1 focus:ring-neon-cyan/50 transition-all"
              />
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-xl bg-gradient-to-r from-neon-blue to-neon-cyan py-3 text-sm font-semibold text-background hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2"
            >
              Access Dashboard
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Portfolio
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Animated background glow */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-neon-blue/5 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-neon-purple/5 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </a>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse" />
              <span className="text-sm font-medium bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">
              {messages.length} {messages.length === 1 ? "message" : "messages"}
            </div>
            <motion.button
              onClick={() => fetchMessages()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-xs hover:border-neon-cyan/50 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </motion.button>
            <motion.button
              onClick={() => {
                localStorage.removeItem("admin_password");
                setIsAuthenticated(false);
                setPassword("");
                setInputPassword("");
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs hover:bg-red-500/20 text-red-400 transition-all"
            >
              Log Out
            </motion.button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          {[
            { label: "Total Messages", value: messages.length, icon: MessageSquare, color: "neon-cyan" },
            { label: "This Week", value: messages.filter(m => new Date(m.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, icon: Clock, color: "neon-purple" },
            { label: "Unique Senders", value: new Set(messages.map(m => m.email)).size, icon: User, color: "neon-blue" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-lg hover:border-neon-cyan/30 transition-all"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-neon-blue/5 blur-2xl group-hover:bg-neon-blue/10 transition-all" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{loading ? "—" : stat.value}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-neon-cyan" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-neon-cyan" />
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center"
          >
            <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <p className="font-medium text-red-400 mb-1">Failed to load messages</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <motion.button
              onClick={fetchMessages}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/20 transition-all"
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="h-20 w-20 rounded-full bg-neon-purple/10 flex items-center justify-center">
              <Mail className="h-9 w-9 text-neon-purple/50" />
            </div>
            <p className="text-xl font-medium">No messages yet</p>
            <p className="text-sm text-muted-foreground">When someone fills out the contact form, messages will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            {/* Messages List */}
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedMessage(msg)}
                  className={`group relative overflow-hidden rounded-2xl border cursor-pointer p-5 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] ${
                    selectedMessage?._id === msg._id
                      ? "border-neon-cyan/50 bg-neon-cyan/5"
                      : "border-border bg-card/50 hover:border-neon-cyan/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 flex items-center justify-center text-sm font-bold">
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-medium truncate">{msg.name}</p>
                          <span className="text-xs text-muted-foreground flex-shrink-0 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(msg.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-neon-cyan truncate">{msg.email}</p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{msg.message}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); setSelectedMessage(msg); }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 rounded-lg hover:bg-neon-cyan/10 text-neon-cyan transition-colors"
                        title="View message"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); setDeleteId(msg._id); }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <AnimatePresence mode="wait">
                {selectedMessage ? (
                  <motion.div
                    key={selectedMessage._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="rounded-2xl border border-neon-cyan/30 bg-card/60 backdrop-blur-xl p-7"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-neon-blue/40 to-neon-purple/40 flex items-center justify-center text-xl font-bold">
                          {selectedMessage.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{selectedMessage.name}</p>
                          <a
                            href={`mailto:${selectedMessage.email}`}
                            className="text-sm text-neon-cyan hover:underline"
                          >
                            {selectedMessage.email}
                          </a>
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    </div>

                    <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(selectedMessage.createdAt)}
                    </div>

                    <div className="rounded-xl border border-border bg-muted/20 p-5 mb-6">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>

                    <div className="flex gap-3">
                      <motion.a
                        href={`mailto:${selectedMessage.email}?subject=Re: Your message&body=Hi ${selectedMessage.name},%0D%0A%0D%0A`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-cyan px-4 py-2.5 text-sm font-medium text-background hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all"
                      >
                        <Mail className="h-4 w-4" />
                        Reply via Email
                      </motion.a>
                      <motion.button
                        onClick={() => setDeleteId(selectedMessage._id)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border border-border bg-card/30 p-10 text-center"
                  >
                    <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Click a message to view details</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="mx-4 w-full max-w-sm rounded-2xl border border-red-500/30 bg-card p-7 shadow-2xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 mx-auto">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="text-center text-lg font-semibold mb-2">Delete Message</h3>
              <p className="text-center text-sm text-muted-foreground mb-6">
                Are you sure you want to delete this message? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm hover:bg-card/80 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 py-2.5 text-sm hover:bg-red-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
