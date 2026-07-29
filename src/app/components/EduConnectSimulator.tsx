import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Smartphone,
  Wifi,
  Battery,
  Send,
  BookOpen,
  MessageSquare,
  User,
  Check,
  Play,
  FileText,
  ChevronLeft,
  Download,
  Award,
  Settings,
  Plus,
  Sparkles,
  X,
  Bell,
  GraduationCap,
  ArrowRight,
  Laptop,
  LogOut,
  CheckCircle2,
  Activity,
  Edit2
} from "lucide-react";

// Types
interface Message {
  id: number;
  sender: "user" | "other";
  text: string;
  timestamp: string;
}

interface ClassItem {
  id: number;
  name: string;
  code: string;
  teacher: string;
  color: string;
  resources: { id: number; name: string; size: string; type: string }[];
  assignments: { id: number; name: string; due: string; status: "Graded" | "Pending" | "Completed"; score?: string }[];
}

interface Announcement {
  id: number;
  class: string;
  text: string;
  time: string;
  author: string;
}

export default function EduConnectSimulator({ onClose }: { onClose: () => void }) {
  // Simulator state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [loginEmail, setLoginEmail] = useState("student@educonnect.edu");
  const [loginPassword] = useState("••••••••");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Connecting to server...");
  const [currentTab, setCurrentTab] = useState<"home" | "classes" | "chat" | "profile">("home");
  
  // App state
  const [activeClassId, setActiveClassId] = useState<number | null>(null);
  const [downloadedResources, setDownloadedResources] = useState<number[]>([]);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { id: 1, sender: "other", text: "Hi Alex, did you have a chance to look at the lab preparation guidelines?", timestamp: "10:15 AM" },
    { id: 2, sender: "user", text: "Yes, I'm working on it now. Will the lab report be due on Friday?", timestamp: "10:17 AM" },
    { id: 3, sender: "other", text: "Yes, by 11:59 PM. Let me know if you need help.", timestamp: "10:18 AM" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Custom classes & announcements to allow teacher updates
  const [classes, setClasses] = useState<ClassItem[]>([
    {
      id: 1,
      name: "Advanced Chemistry",
      code: "CHEM-302",
      teacher: "Dr. Sarah Jenkins",
      color: "from-cyan-500 to-blue-600",
      resources: [
        { id: 101, name: "Molecular_Bonds_Lecture.pdf", size: "2.4 MB", type: "pdf" },
        { id: 102, name: "Lab_03_Procedure.pdf", size: "1.1 MB", type: "pdf" },
        { id: 103, name: "Experiment_Video.mp4", size: "38.2 MB", type: "video" }
      ],
      assignments: [
        { id: 201, name: "Homework 1: Covalent Bonds", due: "Completed", status: "Graded", score: "96/100" },
        { id: 202, name: "Lab Report 3: Spectroscopy", due: "Tomorrow, 11:59 PM", status: "Pending" }
      ]
    },
    {
      id: 2,
      name: "Calculus & Geometry",
      code: "MATH-201",
      teacher: "Prof. Alan Smith",
      color: "from-purple-500 to-indigo-600",
      resources: [
        { id: 104, name: "Integration_Techniques.pdf", size: "3.1 MB", type: "pdf" },
        { id: 105, name: "Calculus_CheatSheet.pdf", size: "850 KB", type: "pdf" }
      ],
      assignments: [
        { id: 203, name: "Problem Set 4: Integration", due: "Completed", status: "Completed" }
      ]
    },
    {
      id: 3,
      name: "Intro to Programming",
      code: "CS-101",
      teacher: "Dr. James Carter",
      color: "from-emerald-500 to-teal-600",
      resources: [
        { id: 106, name: "Python_Basics_Slides.pdf", size: "4.5 MB", type: "pdf" },
        { id: 107, name: "Coding_Guidelines.pdf", size: "1.2 MB", type: "pdf" }
      ],
      assignments: [
        { id: 204, name: "Project 1: Tic Tac Toe", due: "In 3 Days", status: "Pending" }
      ]
    }
  ]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 1, class: "CHEM-302", text: "Math homework 4 deadline extended to Friday morning.", time: "2h ago", author: "Dr. Sarah Jenkins" },
    { id: 2, class: "MATH-201", text: "Midterm exam grades have been published under your profiles.", time: "4h ago", author: "Prof. Alan Smith" },
    { id: 3, class: "CS-101", text: "Lab session tomorrow will be in Room 402 instead of 401.", time: "1d ago", author: "Dr. James Carter" }
  ]);

  // Ref for auto-scrolling chat
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  // Show dynamic time in status bar
  const [time, setTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Switch role animation
  const handleRoleChange = (newRole: "student" | "teacher") => {
    setIsLoading(true);
    setLoadingText(`Configuring ${newRole === "student" ? "Student" : "Teacher"} space...`);
    setTimeout(() => {
      setRole(newRole);
      setIsLoading(false);
      setCurrentTab("home");
      setActiveClassId(null);
      // Reset chat messages for teacher perspective
      if (newRole === "teacher") {
        setChatMessages([
          { id: 1, sender: "other", text: "Hello Dr. Jenkins, I was wondering if I could get extension for the Spectroscopy lab?", timestamp: "11:02 AM" },
          { id: 2, sender: "user", text: "Hi Alex, why do you need an extension?", timestamp: "11:05 AM" },
          { id: 3, sender: "other", text: "I have two midterms on Thursday and need a bit more time to complete the calculations.", timestamp: "11:06 AM" }
        ]);
      } else {
        setChatMessages([
          { id: 1, sender: "other", text: "Hi Alex, did you have a chance to look at the lab preparation guidelines?", timestamp: "10:15 AM" },
          { id: 2, sender: "user", text: "Yes, I'm working on it now. Will the lab report be due on Friday?", timestamp: "10:17 AM" },
          { id: 3, sender: "other", text: "Yes, by 11:59 PM. Let me know if you need help.", timestamp: "10:18 AM" }
        ]);
      }
    }, 1200);
  };

  // Mock login operation
  const handleLogin = (selectedRole: "student" | "teacher") => {
    setIsLoading(true);
    setLoadingText("Authenticating credentials...");
    setLoginEmail(selectedRole === "student" ? "student@educonnect.edu" : "teacher@educonnect.edu");
    
    setTimeout(() => {
      setLoadingText("Fetching cloud resources...");
      setTimeout(() => {
        setRole(selectedRole);
        setIsLoggedIn(true);
        setIsLoading(false);
        setCurrentTab("home");
      }, 800);
    }, 800);
  };

  // Simulated resource download
  const handleDownload = (id: number, name: string) => {
    if (downloadedResources.includes(id)) {
      triggerToast("File already downloaded!");
      return;
    }
    setDownloadingId(id);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadedResources((curr) => [...curr, id]);
          setDownloadingId(null);
          triggerToast(`Downloaded ${name}`);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  // Simulated assignment submission
  const handleSubmitAssignment = (classId: number, assignmentId: number) => {
    setClasses((currClasses) =>
      currClasses.map((c) => {
        if (c.id === classId) {
          return {
            ...c,
            assignments: c.assignments.map((a) =>
              a.id === assignmentId ? { ...a, status: "Completed" as const } : a
            ),
          };
        }
        return c;
      })
    );
    
    // Confetti effect
    setConfettiActive(true);
    triggerToast("Assignment submitted successfully!");
    setTimeout(() => setConfettiActive(false), 3000);
  };

  // Simulated Chat Bot Reply logic
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const typedText = chatInput;
    setChatInput("");
    setIsTyping(true);

    // Auto response
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "";
      
      if (role === "student") {
        const textLower = typedText.toLowerCase();
        if (textLower.includes("question") || textLower.includes("trouble") || textLower.includes("help")) {
          replyText = "Question 4 covers molecular weight calculations. Check the Chemistry Lecture slides in the Resources tab, or let's discuss during my office hours tomorrow at 2 PM.";
        } else if (textLower.includes("thank") || textLower.includes("ok") || textLower.includes("cool")) {
          replyText = "You're welcome! Make sure to review the lab safety guidelines before class tomorrow.";
        } else if (textLower.includes("guidelines") || textLower.includes("outline") || textLower.includes("where")) {
          replyText = "They are uploaded in the Classrooms section under Advanced Chemistry -> Resources.";
        } else {
          replyText = "I see. Let's make sure we review this in detail. Feel free to stop by my office if you need further clarifications.";
        }
      } else {
        // Teacher mode, responding as student Alex
        replyText = "Thank you Dr. Jenkins! I really appreciate the flexibility. I will upload my lab report by tomorrow night.";
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "other",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 1500);
  };

  // Teacher Action: Create Class
  const [showCreateClassForm, setShowCreateClassForm] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassCode, setNewClassCode] = useState("");

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !newClassCode.trim()) return;

    const gradients = [
      "from-orange-500 to-amber-600",
      "from-rose-500 to-pink-600",
      "from-blue-500 to-cyan-600"
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const newClass: ClassItem = {
      id: Date.now(),
      name: newClassName,
      code: newClassCode.toUpperCase(),
      teacher: "Dr. Sarah Jenkins",
      color: randomGradient,
      resources: [
        { id: Date.now() + 2, name: "Course_Syllabus.pdf", size: "1.8 MB", type: "pdf" }
      ],
      assignments: []
    };

    setClasses((prev) => [...prev, newClass]);
    setNewClassName("");
    setNewClassCode("");
    setShowCreateClassForm(false);
    triggerToast("Created new class!");
  };

  // Teacher Action: Create Assignment
  const [showCreateAssignmentForm, setShowCreateAssignmentForm] = useState(false);
  const [newAssignmentName, setNewAssignmentName] = useState("");
  const [newAssignmentDue, setNewAssignmentDue] = useState("");

  const handleCreateAssignment = (classId: number) => {
    if (!newAssignmentName.trim() || !newAssignmentDue.trim()) return;

    setClasses((currClasses) =>
      currClasses.map((c) => {
        if (c.id === classId) {
          return {
            ...c,
            assignments: [
              ...c.assignments,
              {
                id: Date.now(),
                name: newAssignmentName,
                due: newAssignmentDue,
                status: "Pending" as const
              }
            ]
          };
        }
        return c;
      })
    );

    setNewAssignmentName("");
    setNewAssignmentDue("");
    setShowCreateAssignmentForm(false);
    triggerToast("Assignment created and assigned to students!");
  };

  // Teacher Action: Edit Student Grade
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editedGrade, setEditedGrade] = useState("95/100");

  const handleSaveGrade = (classId: number, assignmentId: number, newScore: string) => {
    setClasses((currClasses) =>
      currClasses.map((c) => {
        if (c.id === classId) {
          return {
            ...c,
            assignments: c.assignments.map((a) =>
              a.id === assignmentId ? { ...a, score: newScore, status: "Graded" as const } : a
            ),
          };
        }
        return c;
      })
    );
    setEditingStudentId(null);
    triggerToast("Grade updated successfully!");
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-center items-start lg:items-center p-4 lg:p-8 bg-background/80 backdrop-blur-md overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col items-center justify-center w-full max-w-5xl gap-8 lg:flex-row my-auto cursor-default"
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 right-0 lg:-top-6 lg:-right-6 p-2 rounded-full border border-border bg-card/80 hover:bg-neon-pink/10 hover:border-neon-pink/50 transition-all z-50 group shadow-md"
          title="Close Simulator"
        >
          <X className="h-4 w-4 text-muted-foreground group-hover:text-neon-pink group-hover:rotate-90 transition-all" />
        </button>
        {/* Information Panel */}
        <div className="flex-1 text-left space-y-4 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/10">
            <Smartphone className="h-4 w-4 text-neon-cyan" />
            <span className="text-xs text-neon-cyan font-medium">Interactive App Demo</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent">
            EduConnect Simulator
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Experience the full Flutter application directly in your browser. We built this interactive mock environment to showcase exactly how EduConnect connects teachers and students.
          </p>
          <div className="space-y-3 bg-card/40 border border-border/50 p-5 rounded-2xl backdrop-blur-sm">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-neon-purple animate-pulse" /> Try these interactive flows:
            </h4>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
              <li>Toggle roles between <strong className="text-neon-cyan">Student</strong> and <strong className="text-neon-purple">Teacher</strong> in the Profile tab.</li>
              <li>Go to <strong className="text-foreground">Classrooms</strong> to download materials or submit assignments.</li>
              <li>Navigate to <strong className="text-foreground">Chat</strong> and send custom messages to test the smart reply bot.</li>
              <li>Switch to <strong className="text-neon-purple">Teacher View</strong> to create custom classes, assign tasks, or grade students.</li>
            </ul>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border hover:border-neon-pink/50 bg-card hover:bg-neon-pink/10 transition-all text-sm group"
          >
            <X className="h-4 w-4 text-muted-foreground group-hover:text-neon-pink group-hover:rotate-90 transition-all" />
            <span>Close Simulator</span>
          </button>
        </div>

        {/* Smartphone Shell Container */}
        <div className="relative flex items-center justify-center p-4">
          {/* Subtle phone shadow/glow */}
          <div className={`absolute inset-4 -z-10 rounded-[45px] blur-3xl transition-colors duration-1000 ${role === "student" ? "bg-neon-blue/20" : "bg-neon-purple/20"}`} />

          {/* Smartphone Hardware Frame */}
          <div className="w-[360px] h-[720px] rounded-[50px] border-[10px] border-neutral-800 bg-neutral-950 relative shadow-2xl flex flex-col overflow-hidden select-none">
            
            {/* Screen Notch / Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 rounded-full bg-black z-40 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-neutral-900 absolute right-3" />
            </div>

            {/* Status Bar */}
            <div className="h-10 bg-neutral-950 px-6 flex items-center justify-between text-[11px] text-white/90 font-medium z-30 pt-2 shrink-0">
              <span>{time || "13:04"}</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="h-3 w-3" />
                <span className="text-[9px]">5G</span>
                <Battery className="h-3.5 w-3.5 rotate-90 origin-center text-white" />
              </div>
            </div>

            {/* SCREEN CONTENT AREA */}
            <div className="flex-1 bg-[#09090b] text-neutral-100 relative flex flex-col overflow-hidden text-left">
              
              {/* App Toast Notification inside Phone */}
              <AnimatePresence>
                {toastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-12 left-4 right-4 bg-neutral-900/90 border border-neutral-700/50 text-white px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg z-50 backdrop-blur-md"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{toastMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confetti Particle Explosion Inside screen */}
              {confettiActive && (
                <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                  {[...Array(24)].map((_, i) => {
                    const randomX = Math.random() * 100;
                    const randomY = -20 - Math.random() * 40;
                    const randomRot = Math.random() * 360;
                    const colors = ["bg-cyan-400", "bg-purple-500", "bg-yellow-400", "bg-pink-500", "bg-emerald-400"];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    return (
                      <motion.div
                        key={i}
                        initial={{ x: `${50}%`, y: "90%", rotate: 0, scale: 0.5, opacity: 1 }}
                        animate={{
                          x: `${randomX}%`,
                          y: `${100 + randomY}%`,
                          rotate: randomRot,
                          scale: [0.5, 1, 0.8],
                          opacity: [1, 1, 0]
                        }}
                        transition={{ duration: 1.5 + Math.random(), ease: "easeOut" }}
                        className={`absolute w-3 h-3 rounded-sm ${randomColor}`}
                      />
                    );
                  })}
                </div>
              )}

              {/* Simulator Loading Overlay */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50"
                  >
                    <div className="relative flex items-center justify-center">
                      {/* Flutter-like loader */}
                      <div className="w-12 h-12 rounded-full border-4 border-neutral-800 border-t-neon-blue animate-spin" />
                      <GraduationCap className="h-5 w-5 text-neon-blue absolute" />
                    </div>
                    <p className="mt-4 text-sm text-neutral-400 font-medium animate-pulse">
                      {loadingText}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ROUTER CONTENT CONTAINER */}
              {!isLoggedIn ? (
                /* LOGIN SCREEN */
                <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-neutral-900 to-[#09090b]">
                  <div className="flex-1 flex flex-col justify-center space-y-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center shadow-lg shadow-neon-blue/10">
                        <GraduationCap className="h-8 w-8 text-black" />
                      </div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent tracking-tight">
                        EduConnect
                      </h1>
                      <p className="text-xs text-neutral-400 max-w-[200px]">
                        Bridging the gap between teachers and students
                      </p>
                    </div>

                    {/* Login Form Fields */}
                    <div className="space-y-3 pt-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Email Address</label>
                        <input
                          type="text"
                          value={loginEmail}
                          disabled
                          className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-300 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Password</label>
                        <input
                          type="password"
                          value={loginPassword}
                          disabled
                          className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-300 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Quick Demo Login Cards */}
                    <div className="space-y-2 pt-2">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block text-center">
                        Quick Login As:
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleLogin("student")}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 hover:bg-neon-cyan/10 transition-colors"
                        >
                          <User className="h-4 w-4 text-neon-cyan" />
                          <span className="text-[11px] font-semibold text-neon-cyan">Student</span>
                        </button>
                        <button
                          onClick={() => handleLogin("teacher")}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-neon-purple/20 bg-neon-purple/5 hover:bg-neon-purple/10 transition-colors"
                        >
                          <GraduationCap className="h-4 w-4 text-neon-purple" />
                          <span className="text-[11px] font-semibold text-neon-purple">Teacher</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-center text-neutral-500">
                    Secure Flutter Demo Sandbox • V1.4.2
                  </div>
                </div>
              ) : (
                /* MAIN APP SHELL */
                <div className="flex-1 flex flex-col overflow-hidden bg-neutral-950">
                  
                  {/* APP BAR HEADER */}
                  <div className="h-12 border-b border-neutral-900 bg-neutral-950 px-4 flex items-center justify-between z-20 shrink-0">
                    <div className="flex items-center gap-2">
                      {activeClassId !== null && (
                        <button
                          onClick={() => setActiveClassId(null)}
                          className="p-1 -ml-1 rounded-lg hover:bg-neutral-900"
                        >
                          <ChevronLeft className="h-5 w-5 text-neutral-400" />
                        </button>
                      )}
                      <span className="text-sm font-semibold text-neutral-200">
                        {activeClassId !== null
                          ? classes.find((c) => c.id === activeClassId)?.name
                          : currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative cursor-pointer">
                        <Bell className="h-4 w-4 text-neutral-400 hover:text-neutral-200" />
                        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 text-[8px] font-bold rounded-full flex items-center justify-center text-white scale-90">
                          2
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setIsLoggedIn(false);
                          triggerToast("Logged out successfully");
                        }}
                        className="p-1 rounded-lg hover:bg-neutral-900 text-neutral-400 hover:text-red-400"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* SCREEN TAB PANELS */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 pb-8">
                    
                    {/* TAB: HOME */}
                    {currentTab === "home" && activeClassId === null && (
                      <div className="space-y-5">
                        
                        {/* Welcome Card */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-neutral-900 to-neutral-900/60 p-4 rounded-2xl border border-neutral-800/80">
                          <div>
                            <p className="text-[10px] text-neutral-400">Welcome Back</p>
                            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                              {role === "student" ? "Alex Rivera 👋" : "Dr. Sarah Jenkins 🎓"}
                            </h3>
                          </div>
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${role === "student" ? "bg-neon-cyan/20 text-neon-cyan" : "bg-neon-purple/20 text-neon-purple"}`}>
                            {role === "student" ? "AR" : "SJ"}
                          </div>
                        </div>

                        {/* Progress Widget (Student) or Engagement Chart (Teacher) */}
                        {role === "student" ? (
                          <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-neutral-300">Weekly Progress</span>
                              <span className="text-[10px] text-neutral-400">Due: 1 Task left</span>
                            </div>
                            <div className="flex items-center gap-4">
                              {/* Circle SVG */}
                              <div className="relative w-14 h-14 shrink-0">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                  <path className="text-neutral-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                  <path className="text-neon-cyan" strokeDasharray="78, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-neutral-200">78%</span>
                              </div>
                              <div className="space-y-0.5">
                                <h4 className="text-xs font-semibold text-white">Almost there!</h4>
                                <p className="text-[9px] text-neutral-400 leading-snug">
                                  You are in the top 5% of Chemistry class this week. Review Spectroscopy guidelines.
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1">
                                <Activity className="h-3.5 w-3.5 text-neon-purple animate-pulse" />
                                Activity metrics
                              </span>
                              <span className="text-[9px] text-neon-purple uppercase font-bold tracking-wider">Live Stats</span>
                            </div>
                            
                            {/* Interactive mini SVG Bar Chart */}
                            <div className="h-16 flex items-end justify-between px-2 pt-2 border-b border-neutral-800">
                              {[
                                { day: "M", val: "h-8 bg-neon-purple/40" },
                                { day: "T", val: "h-11 bg-neon-purple/60" },
                                { day: "W", val: "h-14 bg-neon-purple" },
                                { day: "T", val: "h-9 bg-neon-purple/50" },
                                { day: "F", val: "h-12 bg-neon-purple/80" }
                              ].map((bar, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-1 w-6">
                                  <div className={`w-3.5 rounded-t-sm transition-all duration-500 ${bar.val}`} />
                                  <span className="text-[8px] text-neutral-500">{bar.day}</span>
                                </div>
                              ))}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-center text-[10px] pt-1">
                              <div className="bg-neutral-950/50 p-1.5 rounded-lg border border-neutral-800">
                                <div className="font-bold text-white">96%</div>
                                <div className="text-[8px] text-neutral-500">Attendance</div>
                              </div>
                              <div className="bg-neutral-950/50 p-1.5 rounded-lg border border-neutral-800">
                                <div className="font-bold text-white">12</div>
                                <div className="text-[8px] text-neutral-500">Grading Pending</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Quick Dashboard Action Row (Teacher only) */}
                        {role === "teacher" && (
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => setShowCreateClassForm(true)}
                              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-neon-purple bg-neon-purple/10 hover:bg-neon-purple/20 transition-all text-xs font-semibold text-neon-purple"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Create Class
                            </button>
                            <button
                              onClick={() => {
                                const txt = prompt("Enter announcement text:");
                                if (txt) {
                                  const newAnn: Announcement = {
                                    id: Date.now(),
                                    class: "CHEM-302",
                                    text: txt,
                                    time: "Just now",
                                    author: "Dr. Sarah Jenkins"
                                  };
                                  setAnnouncements(prev => [newAnn, ...prev]);
                                  triggerToast("Announcement posted!");
                                }
                              }}
                              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition-all text-xs font-semibold text-neutral-300"
                            >
                              <Bell className="h-3.5 w-3.5" />
                              Announce
                            </button>
                          </div>
                        )}

                        {/* Teacher's Create Class Form Modal overlay inside screen */}
                        {showCreateClassForm && (
                          <form onSubmit={handleCreateClass} className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-3">
                            <h4 className="text-xs font-semibold text-neutral-200">Create New Class</h4>
                            <input
                              type="text"
                              placeholder="Class Name (e.g. Physics 102)"
                              value={newClassName}
                              onChange={(e) => setNewClassName(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Code (e.g. PHYS-102)"
                              value={newClassCode}
                              onChange={(e) => setNewClassCode(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300"
                              required
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => setShowCreateClassForm(false)}
                                className="px-3 py-1 text-[10px] border border-neutral-800 rounded-lg text-neutral-400 hover:bg-neutral-800"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-3 py-1 text-[10px] bg-neon-purple rounded-lg text-white font-semibold"
                              >
                                Create
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Horizontally scrollable enrolled classes list */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-neutral-300">My Classes</span>
                            <span className="text-[10px] text-neutral-500 cursor-pointer" onClick={() => setCurrentTab("classes")}>See All</span>
                          </div>
                          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar snap-x">
                            {classes.map((cls) => (
                              <div
                                key={cls.id}
                                onClick={() => setActiveClassId(cls.id)}
                                className={`w-36 shrink-0 bg-gradient-to-br ${cls.color} p-3.5 rounded-xl text-neutral-100 flex flex-col justify-between h-28 snap-start cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md`}
                              >
                                <div className="space-y-0.5">
                                  <span className="text-[8px] bg-black/35 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                    {cls.code}
                                  </span>
                                  <h4 className="text-xs font-bold leading-tight line-clamp-2 pt-1.5">{cls.name}</h4>
                                </div>
                                <span className="text-[9px] text-white/80">{cls.teacher}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent Announcements Board */}
                        <div className="space-y-2.5">
                          <span className="text-xs font-semibold text-neutral-300 block">Announcements</span>
                          <div className="space-y-2">
                            {announcements.map((ann) => (
                              <div key={ann.id} className="bg-neutral-900/60 border border-neutral-850 p-3 rounded-xl flex flex-col space-y-1.5">
                                <div className="flex justify-between text-[8px]">
                                  <span className="font-bold text-neon-cyan">{ann.class}</span>
                                  <span className="text-neutral-500">{ann.time}</span>
                                </div>
                                <p className="text-[11px] text-neutral-300 leading-relaxed">{ann.text}</p>
                                <span className="text-[9px] text-neutral-500">— {ann.author}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: CLASSES & INDIVIDUAL CLASS VIEW */}
                    {currentTab === "classes" && activeClassId === null && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-neutral-400">Select a class to view files and assignments:</span>
                          {role === "teacher" && (
                            <button
                              onClick={() => setShowCreateClassForm(true)}
                              className="p-1 rounded-lg border border-neon-purple/30 bg-neon-purple/10 text-neon-purple flex items-center gap-0.5 text-[10px]"
                            >
                              <Plus className="h-3 w-3" /> New
                            </button>
                          )}
                        </div>

                        {showCreateClassForm && (
                          <form onSubmit={handleCreateClass} className="bg-neutral-900 border border-neutral-850 p-4 rounded-xl space-y-3">
                            <h4 className="text-xs font-semibold text-neutral-200">Create New Class</h4>
                            <input
                              type="text"
                              placeholder="Class Name"
                              value={newClassName}
                              onChange={(e) => setNewClassName(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Class Code"
                              value={newClassCode}
                              onChange={(e) => setNewClassCode(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300"
                              required
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => setShowCreateClassForm(false)}
                                className="px-3 py-1 text-[10px] border border-neutral-800 rounded-lg text-neutral-400 hover:bg-neutral-850"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-3 py-1 text-[10px] bg-neon-purple rounded-lg text-white font-semibold"
                              >
                                Create
                              </button>
                            </div>
                          </form>
                        )}

                        <div className="space-y-3">
                          {classes.map((cls) => (
                            <div
                              key={cls.id}
                              onClick={() => setActiveClassId(cls.id)}
                              className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl cursor-pointer hover:border-neutral-700 hover:bg-neutral-900/80 transition-all flex items-center justify-between"
                            >
                              <div className="space-y-1">
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${role === "student" ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/25" : "bg-neon-purple/15 text-neon-purple border border-neon-purple/25"}`}>
                                  {cls.code}
                                </span>
                                <h4 className="text-sm font-bold text-white">{cls.name}</h4>
                                <p className="text-[10px] text-neutral-500">Instructor: {cls.teacher}</p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-neutral-600 hover:text-neutral-300" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* DETAILED CLASSROOM PAGE (When classroom is active) */}
                    {activeClassId !== null && (
                      <div className="space-y-5">
                        
                        {/* Class Meta Panel */}
                        {(() => {
                          const cls = classes.find((c) => c.id === activeClassId);
                          if (!cls) return null;
                          return (
                            <div className="space-y-4">
                              {/* Header Card */}
                              <div className={`p-4 rounded-xl bg-gradient-to-br ${cls.color} text-white space-y-1`}>
                                <span className="text-[9px] bg-black/35 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{cls.code}</span>
                                <h3 className="text-base font-bold">{cls.name}</h3>
                                <p className="text-[10px] text-white/80">{cls.teacher} • Virtual Room Active</p>
                              </div>

                              {/* Resources Section */}
                              <div className="space-y-2">
                                <h4 className="text-xs font-semibold text-neutral-300">Class Resources</h4>
                                <div className="space-y-2">
                                  {cls.resources.map((res) => (
                                    <div
                                      key={res.id}
                                      className="bg-neutral-900 border border-neutral-850 p-3 rounded-xl flex items-center justify-between gap-3 text-left"
                                    >
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                                          {res.type === "video" ? (
                                            <Play className="h-4 w-4 text-neon-cyan" />
                                          ) : (
                                            <FileText className="h-4 w-4 text-neutral-400" />
                                          )}
                                        </div>
                                        <div className="min-w-0">
                                          <p className="text-xs font-medium text-neutral-200 truncate">{res.name}</p>
                                          <p className="text-[9px] text-neutral-500">{res.size}</p>
                                        </div>
                                      </div>
                                      
                                      {downloadingId === res.id ? (
                                        <div className="flex flex-col items-center w-12 text-[9px] text-neon-cyan font-bold gap-1 shrink-0">
                                          <div className="w-8 h-1 bg-neutral-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-neon-cyan" style={{ width: `${downloadProgress}%` }} />
                                          </div>
                                          <span>{downloadProgress}%</span>
                                        </div>
                                      ) : downloadedResources.includes(res.id) ? (
                                        <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => handleDownload(res.id, res.name)}
                                          disabled={downloadingId !== null}
                                          className="w-8 h-8 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 flex items-center justify-center shrink-0"
                                        >
                                          <Download className="h-3.5 w-3.5 text-neutral-400" />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Assignments Section */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-xs font-semibold text-neutral-300">Assignments</h4>
                                  {role === "teacher" && (
                                    <button
                                      onClick={() => setShowCreateAssignmentForm(true)}
                                      className="p-1 rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 flex items-center gap-0.5 text-[9px]"
                                    >
                                      <Plus className="h-3 w-3" /> Add Task
                                    </button>
                                  )}
                                </div>

                                {showCreateAssignmentForm && (
                                  <div className="bg-neutral-900 border border-neutral-850 p-4 rounded-xl space-y-3">
                                    <h4 className="text-xs font-semibold text-neutral-200">New Assignment</h4>
                                    <input
                                      type="text"
                                      placeholder="Title (e.g. Lab Report 4)"
                                      value={newAssignmentName}
                                      onChange={(e) => setNewAssignmentName(e.target.value)}
                                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Due Date (e.g. In 2 Days)"
                                      value={newAssignmentDue}
                                      onChange={(e) => setNewAssignmentDue(e.target.value)}
                                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300"
                                    />
                                    <div className="flex gap-2 justify-end">
                                      <button
                                        onClick={() => setShowCreateAssignmentForm(false)}
                                        className="px-3 py-1 text-[10px] border border-neutral-800 rounded-lg text-neutral-400"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => handleCreateAssignment(cls.id)}
                                        className="px-3 py-1 text-[10px] bg-neon-purple rounded-lg text-white font-semibold"
                                      >
                                        Assign
                                      </button>
                                    </div>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  {cls.assignments.length === 0 ? (
                                    <p className="text-[10px] text-neutral-500 text-center py-2">No active assignments assigned</p>
                                  ) : (
                                    cls.assignments.map((asg) => (
                                      <div
                                        key={asg.id}
                                        className="bg-neutral-900 border border-neutral-850 p-3.5 rounded-xl space-y-2.5 text-left"
                                      >
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <p className="text-xs font-medium text-neutral-200">{asg.name}</p>
                                            <p className="text-[9px] text-neutral-500">
                                              {asg.status === "Completed" || asg.status === "Graded"
                                                ? "Submitted"
                                                : `Due: ${asg.due}`}
                                            </p>
                                          </div>
                                          
                                          {asg.status === "Graded" ? (
                                            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded font-bold text-emerald-400">
                                              {asg.score}
                                            </span>
                                          ) : asg.status === "Completed" ? (
                                            <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded font-bold text-cyan-400">
                                              Pending Grade
                                            </span>
                                          ) : (
                                            <span className="text-[10px] bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded font-bold text-amber-400">
                                              Assigned
                                            </span>
                                          )}
                                        </div>

                                        {/* Action: Submit Assignment (Student View) */}
                                        {role === "student" && asg.status === "Pending" && (
                                          <button
                                            onClick={() => handleSubmitAssignment(cls.id, asg.id)}
                                            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-neon-cyan hover:bg-neon-cyan/95 text-xs text-black font-bold transition-all shadow-md shadow-neon-cyan/5 cursor-pointer"
                                          >
                                            Upload & Submit Solution
                                          </button>
                                        )}

                                        {/* Action: Grade Assignment (Teacher View) */}
                                        {role === "teacher" && (
                                          <div className="border-t border-neutral-800/80 pt-2 flex items-center justify-between text-[10px]">
                                            <span className="text-neutral-500">Student: Alex Rivera</span>
                                            {editingStudentId === asg.id ? (
                                              <div className="flex items-center gap-1.5">
                                                <input
                                                  type="text"
                                                  value={editedGrade}
                                                  onChange={(e) => setEditedGrade(e.target.value)}
                                                  className="w-16 bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-center text-white text-[10px]"
                                                />
                                                <button
                                                  onClick={() => handleSaveGrade(cls.id, asg.id, editedGrade)}
                                                  className="bg-emerald-600 px-2 py-0.5 rounded text-white font-bold"
                                                >
                                                  Save
                                                </button>
                                              </div>
                                            ) : (
                                              <button
                                                onClick={() => {
                                                  setEditingStudentId(asg.id);
                                                  setEditedGrade(asg.score || "95/100");
                                                }}
                                                className="text-neon-purple hover:underline font-semibold flex items-center gap-0.5"
                                              >
                                                <Edit2 className="h-3 w-3" />
                                                {asg.status === "Graded" ? "Change Grade" : "Grade Submission"}
                                              </button>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* TAB: CHAT / MESSAGES */}
                    {currentTab === "chat" && activeClassId === null && (
                      <div className="flex flex-col h-[560px] -mx-4 -my-3 overflow-hidden bg-neutral-950 relative">
                        
                        {/* Conversation Header */}
                        <div className="px-4 py-2 border-b border-neutral-900/60 bg-neutral-900/40 flex items-center gap-2.5 shrink-0 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${role === "student" ? "bg-cyan-500/20 text-cyan-400" : "bg-purple-500/20 text-purple-400"}`}>
                            {role === "student" ? "SJ" : "AR"}
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-white">
                              {role === "student" ? "Dr. Sarah Jenkins (Chemistry)" : "Alex Rivera (Student)"}
                            </h4>
                            <p className="text-[9px] text-emerald-400 font-medium">Online</p>
                          </div>
                        </div>

                        {/* Message Stream */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 flex flex-col">
                          {chatMessages.map((msg) => {
                            const isMe = msg.sender === "user";
                            return (
                              <div
                                key={msg.id}
                                className={`flex flex-col max-w-[75%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
                              >
                                <div
                                  className={`px-3.5 py-2.5 rounded-2xl text-[11px] leading-relaxed select-text ${
                                    isMe
                                      ? role === "student"
                                        ? "bg-neon-cyan text-black font-medium rounded-tr-none"
                                        : "bg-neon-purple text-white font-medium rounded-tr-none"
                                      : "bg-neutral-900 text-neutral-200 rounded-tl-none border border-neutral-850"
                                  }`}
                                >
                                  {msg.text}
                                </div>
                                <span className="text-[8px] text-neutral-500 mt-1 px-1">{msg.timestamp}</span>
                              </div>
                            );
                          })}

                          {isTyping && (
                            <div className="mr-auto items-start max-w-[75%] flex flex-col space-y-1">
                              <div className="bg-neutral-900/60 border border-neutral-850 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                              </div>
                            </div>
                          )}

                          <div ref={chatBottomRef} />
                        </div>

                        {/* Interactive Quick Reply Suggestion Chips */}
                        {chatMessages.length > 0 && !isTyping && (
                          <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0 no-scrollbar select-none z-10 bg-neutral-950">
                            {role === "student" ? (
                              <>
                                <button
                                  onClick={() => {
                                    setChatInput("Where can I find the lab guidelines?");
                                  }}
                                  className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-[10px] text-neutral-400 hover:text-white shrink-0"
                                >
                                  Where are guidelines?
                                </button>
                                <button
                                  onClick={() => {
                                    setChatInput("I'm having trouble with Question 4.");
                                  }}
                                  className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-[10px] text-neutral-400 hover:text-white shrink-0"
                                >
                                  Need help with Q4
                                </button>
                                <button
                                  onClick={() => {
                                    setChatInput("Thank you, Dr. Jenkins!");
                                  }}
                                  className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-[10px] text-neutral-400 hover:text-white shrink-0"
                                >
                                  Thank you!
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setChatInput("Hi Alex, please make sure you upload the files soon.");
                                  }}
                                  className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-[10px] text-neutral-400 hover:text-white shrink-0"
                                >
                                  Ask for upload
                                </button>
                                <button
                                  onClick={() => {
                                    setChatInput("I've checked your assignment grade. Good job.");
                                  }}
                                  className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900 text-[10px] text-neutral-400 hover:text-white shrink-0"
                                >
                                  Praise grade
                                </button>
                              </>
                            )}
                          </div>
                        )}

                        {/* Input Action Bar */}
                        <div className="p-3 border-t border-neutral-900 bg-neutral-950 flex items-center gap-2 shrink-0 z-10">
                          <input
                            type="text"
                            placeholder="Type a message..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-neutral-700 select-text"
                          />
                          <button
                            onClick={handleSendMessage}
                            className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 cursor-pointer ${
                              role === "student" ? "bg-neon-cyan text-black" : "bg-neon-purple text-white"
                            }`}
                          >
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* TAB: PROFILE & ROLE SWITCHER */}
                    {currentTab === "profile" && activeClassId === null && (
                      <div className="space-y-5 text-center">
                        
                        {/* Profile Card */}
                        <div className="bg-neutral-900/60 border border-neutral-850 p-5 rounded-2xl flex flex-col items-center space-y-3">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${
                            role === "student" ? "bg-neon-cyan/20 text-neon-cyan shadow-neon-cyan/5" : "bg-neon-purple/20 text-neon-purple shadow-neon-purple/5"
                          }`}>
                            {role === "student" ? "AR" : "SJ"}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">
                              {role === "student" ? "Alex Rivera" : "Dr. Sarah Jenkins"}
                            </h3>
                            <p className="text-[10px] text-neutral-400">
                              {role === "student" ? "Sophomore Student" : "Senior Chemistry Professor"}
                            </p>
                          </div>
                        </div>

                        {/* DUAL WORKSPACE SWITCHER */}
                        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl space-y-3 text-left">
                          <div>
                            <span className="text-xs font-semibold text-neutral-300 block">Workspace Role</span>
                            <span className="text-[9px] text-neutral-500">Toggle between Student/Teacher perspective:</span>
                          </div>

                          {/* Switch Pill */}
                          <div className="relative h-10 w-full bg-neutral-950 rounded-xl border border-neutral-800 p-1 flex items-center">
                            {/* Sliding selection background */}
                            <motion.div
                              className={`absolute top-1 bottom-1 w-[48%] rounded-lg z-0 ${role === "student" ? "bg-neon-cyan" : "bg-neon-purple"}`}
                              animate={{
                                left: role === "student" ? "4px" : "50%",
                              }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                            
                            <button
                              onClick={() => role !== "student" && handleRoleChange("student")}
                              className={`flex-1 text-center text-xs font-semibold z-10 relative cursor-pointer ${
                                role === "student" ? "text-black" : "text-neutral-400 hover:text-neutral-200"
                              }`}
                            >
                              Student View
                            </button>
                            <button
                              onClick={() => role !== "teacher" && handleRoleChange("teacher")}
                              className={`flex-1 text-center text-xs font-semibold z-10 relative cursor-pointer ${
                                role === "teacher" ? "text-white" : "text-neutral-400 hover:text-neutral-200"
                              }`}
                            >
                              Teacher View
                            </button>
                          </div>
                        </div>

                        {/* Badges / Stats grid */}
                        {role === "student" ? (
                          <div className="space-y-3 text-left">
                            <span className="text-xs font-semibold text-neutral-300">My Achievements</span>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-neutral-900/40 border border-neutral-850 p-3 rounded-xl flex items-center gap-2.5">
                                <Award className="h-5 w-5 text-yellow-400 shrink-0" />
                                <div>
                                  <h5 className="text-[10px] font-bold text-white">Math Wizard</h5>
                                  <p className="text-[8px] text-neutral-500">GPA &gt; 3.8 in Math</p>
                                </div>
                              </div>
                              <div className="bg-neutral-900/40 border border-neutral-850 p-3 rounded-xl flex items-center gap-2.5">
                                <Award className="h-5 w-5 text-neon-cyan shrink-0 animate-pulse" />
                                <div>
                                  <h5 className="text-[10px] font-bold text-white">Top Scorer</h5>
                                  <p className="text-[8px] text-neutral-500">Spectroscopy: 96%</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 text-left">
                            <span className="text-xs font-semibold text-neutral-300">Teaching Stats</span>
                            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                              <div className="bg-neutral-900/40 border border-neutral-850 p-2.5 rounded-xl">
                                <div className="font-bold text-white text-sm">4.9★</div>
                                <div className="text-[8px] text-neutral-500">Rating</div>
                              </div>
                              <div className="bg-neutral-900/40 border border-neutral-850 p-2.5 rounded-xl">
                                <div className="font-bold text-white text-sm">182</div>
                                <div className="text-[8px] text-neutral-500">Students</div>
                              </div>
                              <div className="bg-neutral-900/40 border border-neutral-850 p-2.5 rounded-xl">
                                <div className="font-bold text-white text-sm">142h</div>
                                <div className="text-[8px] text-neutral-500">Session Hrs</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Settings Button */}
                        <div className="pt-2">
                          <button
                            onClick={() => triggerToast("Advanced settings are locked in demo mode.")}
                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 hover:text-white"
                          >
                            <Settings className="h-4 w-4" />
                            Account Settings
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* BOTTOM NAVIGATION TAB BAR */}
                  {activeClassId === null && (
                    <div className="h-14 border-t border-neutral-900 bg-neutral-950/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-30">
                      {[
                        { id: "home", label: "Home", icon: Laptop },
                        { id: "classes", label: "Classes", icon: BookOpen },
                        { id: "chat", label: "Chat", icon: MessageSquare },
                        { id: "profile", label: "Profile", icon: User }
                      ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = currentTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setCurrentTab(tab.id as any)}
                            className="flex flex-col items-center justify-center gap-1 relative cursor-pointer group"
                          >
                            <Icon className={`h-4.5 w-4.5 transition-colors ${
                              isActive
                                ? role === "student"
                                  ? "text-neon-cyan"
                                  : "text-neon-purple"
                                : "text-neutral-500 group-hover:text-neutral-300"
                            }`} />
                            <span className={`text-[8px] tracking-wide transition-colors ${
                              isActive
                                ? "text-neutral-200"
                                : "text-neutral-500 group-hover:text-neutral-300"
                            }`}>
                              {tab.label}
                            </span>
                            
                            {/* Small indicator dot below active tab */}
                            {isActive && (
                              <motion.div
                                layoutId="activeTabDot"
                                className={`absolute -bottom-1.5 w-1 h-1 rounded-full ${
                                  role === "student" ? "bg-neon-cyan" : "bg-neon-purple"
                                }`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Android Bottom Gesture Pill Bar */}
                  <div className="h-4 bg-neutral-950 flex items-center justify-center shrink-0 pb-1.5 z-30">
                    <div className="w-24 h-1 bg-white/40 rounded-full" />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
