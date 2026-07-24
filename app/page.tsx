'use client';
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import GlassNavbar from "@/components/GlassNavbar";

// Lucide Icons Imports
import {
  ShieldCheck,
  ShieldAlert,
  BadgeCheck,
  Building2,
  Lock,
  FileText,
  Clock,
  Globe,
  Bot,
  Brain,
  DollarSign,
  CheckCircle,
  Users,
  Layers,
  Cpu,
  Database,
  Server,
  Zap,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Maximize2,
  FileCheck,
  Activity,
  ArrowRight,
  Search,
  Award,
  AlertCircle,
  Lightbulb,
  Shield,
  CreditCard,
  Target,
  RefreshCw,
  Sliders,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Terminal,
  User
} from "lucide-react";

const LightRays = dynamic(() => import("@/components/LightRays"), {
  ssr: false,
});

const slides = [
  { id: 0, title: "Title",        name: "Title Slide" },
  { id: 1, title: "Intro",        name: "Introduction & Overview" },
  { id: 2, title: "Problem",      name: "Problem Statement" },
  { id: 3, title: "Solution",     name: "Proposed Solution - BugChase" },
  { id: 4, title: "Scope",        name: "Scope of the Project" },
  { id: 5, title: "Feedback",     name: "Capstone-I Feedback" },
  { id: 6, title: "Response",     name: "Feedback Response & Justification" },
  { id: 7, title: "Roles",        name: "System Roles & Responsibilities" },
  { id: 8, title: "Phases",       name: "Completed Tasks Across Phases" },
  { id: 9, title: "Frontend",     name: "Completed Tasks: Frontend" },
  { id: 10, title: "Backend",     name: "Completed Tasks: Backend" },
  { id: 11, title: "AI / ML",     name: "ML & AI Modules" },
  { id: 12, title: "Tech",        name: "Tools & Technologies" },
  { id: 13, title: "Conclusion",  name: "Conclusion & References" },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  // Memoize nav items
  const navItems = useMemo(() => {
    return slides.map((slide, index) => ({
      id: slide.id,
      label: `${index + 1}. ${slide.title}`,
      index: index
    }));
  }, []);

  // GSAP animation setup
  useEffect(() => {
    const initGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollToPlugin = (await import("gsap/ScrollToPlugin")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;

      gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

      slideRefs.current.forEach((slide) => {
        if (!slide) return;

        const heading = slide.querySelector('h1');
        const subContent = slide.querySelectorAll('p, h2, ul, ol, .content-box');

        if (heading) {
          gsap.fromTo(heading,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: slide,
                start: "top 80%",
                scroller: containerRef.current,
                toggleActions: "play reverse play reverse"
              }
            }
          );
        }

        if (subContent.length > 0) {
          gsap.fromTo(subContent,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.06,
              ease: "power2.out",
              scrollTrigger: {
                trigger: slide,
                start: "top 75%",
                scroller: containerRef.current,
                toggleActions: "play reverse play reverse"
              }
            }
          );
        }
      });
    };

    initGSAP();
  }, []);

  const scrollToSlide = useCallback(async (index: number) => {
    if (isScrolling.current) return;
    if (index < 0 || index >= slides.length) return;

    const slideElement = slideRefs.current[index];
    if (slideElement && containerRef.current) {
      isScrolling.current = true;
      const gsap = (await import("gsap")).default;

      gsap.to(containerRef.current, {
        scrollTo: { y: slideElement, autoKill: false },
        duration: 0.9,
        ease: "power4.inOut",
        onComplete: () => {
          isScrolling.current = false;
          setCurrentSlide(index);
        }
      });

      setCurrentSlide(index);
    }
  }, []);

  const handleNavClick = useCallback((index: number) => {
    scrollToSlide(index);
  }, [scrollToSlide]);

  // Scroll detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrolling.current) return;

      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight;

      for (let i = 0; i < slideRefs.current.length; i++) {
        const slide = slideRefs.current[i];
        if (slide) {
          const slideTop = slide.offsetTop;
          const slideBottom = slideTop + slide.offsetHeight;

          if (scrollTop + windowHeight / 2 >= slideTop && scrollTop + windowHeight / 2 < slideBottom) {
            if (currentSlide !== i) {
              setCurrentSlide(i);
            }
            break;
          }
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
        return;
      }

      if (selectedImage) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextSlide = Math.min(currentSlide + 1, slides.length - 1);
        scrollToSlide(nextSlide);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevSlide = Math.max(currentSlide - 1, 0);
        scrollToSlide(prevSlide);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, scrollToSlide, selectedImage]);

  // Helper for glass cards - Transparent iOS 26 style
  const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`backdrop-blur-md bg-white/[0.02] p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[1.75rem] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.25)] ${className}`}>
      {children}
    </div>
  );

  const teamMembers = [
    { name: "Shahzaib Ahmad", role: "Full-Stack & Security Lead" },
    { name: "M. Qasim", role: "AI & Backend Engineer" },
    { name: "Shahzaib", role: "Frontend & UI/UX Developer" },
    { name: "Tauseef Ahmad", role: "Backend & Systems Engineer" },
  ];

  const capstone1FeedbackBullets = [
    "The document requires updates in system diagrams to accurately reflect the actual system flow. The UCD and system design diagrams are not properly linked with the implementation or class objects.",
    "Policies for spam handling, researcher suspension, and discrepancy reporting between researcher findings and RAG analysis are not defined and should be clearly specified in the system design.",
    "There is insufficient research explaining how the core features will be implemented in Capstone-II.",
    "The current approach relies heavily on LLMs, and prioritizing RAG output alone may create reliability issues. RAG results should be used carefully rather than treated as the only source of decision-making.",
    "The system should enforce a proper reward mechanism in the bug bounty program and ensure that users define rewards or select appropriate program types.",
    "Important technical aspects of bug bounty platforms are not properly addressed, including vulnerability severity classification, conflict handling between automated scanners and advanced analysis methods such as RAG, prevention of false duplicate detection, consistent CVSS scoring, and handling incomplete vulnerability scans or restricted testing environments.",
    "Research related to automated bug detection tools is missing, and the system should focus more on automated bug detection rather than manual processes.",
    "The presentation content is not fully aligned with the written document, and several slides appear overly AI-generated, affecting clarity and originality. Slides should be refined to better match the documented work."
  ];

  return (
    <div className="relative min-h-screen w-full select-none" style={{ backgroundColor: '#000000' }}>
      {/* Background Light Rays */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}>
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>
      </div>

      {/* Navigation Bar */}
      <GlassNavbar items={navItems} activeIndex={currentSlide} onItemClick={handleNavClick} />

      {/* Presentation Pages */}
      <div
        ref={containerRef}
        data-scroll-container
        className="relative overflow-y-auto overflow-x-hidden h-screen snap-y snap-mandatory scroll-smooth"
        style={{ scrollBehavior: 'smooth', zIndex: 10 }}
      >

        {/* ── Slide 1: Title Slide ────────────────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[0] = el; }} className="flex items-center justify-center h-screen min-h-screen max-h-screen px-4 sm:px-6 snap-start snap-always pt-20 pb-4 overflow-hidden">
          <div className="max-w-5xl w-full text-center space-y-4 sm:space-y-6">
            <div className="flex justify-center mb-1">
              <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black/60 shadow-[0_0_40px_rgba(59,130,246,0.35)]">
                <Image src="/logo.png" alt="BugChase Logo" width={80} height={80} className="object-cover" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-mono font-medium mb-3 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Capstone-II Final Presentation · Development Project
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 mb-2 pb-1 leading-tight font-sans">
                BugChase
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-blue-100 font-medium max-w-3xl mx-auto leading-snug">
                Full-Stack Bug Bounty &amp; Coordinated Vulnerability Disclosure Platform
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-1">
              {teamMembers.map((member) => (
                <GlassCard key={member.name} className="p-3.5 text-center flex flex-col items-center justify-center gap-1 border-white/10 hover:border-blue-500/40 transition-colors">
                  <BadgeCheck className="w-5 h-5 text-blue-400 mb-0.5" />
                  <p className="text-sm sm:text-base font-bold text-white">{member.name}</p>
                  <p className="text-xs text-blue-300 font-mono font-medium">{member.role}</p>
                </GlassCard>
              ))}
            </div>

            {/* Project Metadata */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-300 font-mono pt-1">
              <span>Institution: <strong className="text-white font-sans font-semibold">Gift University, Gujranwala</strong></span>
              <span>•</span>
              <span>Academic Year: <strong className="text-white font-sans font-semibold">2025-2026</strong></span>
            </div>

            {/* Live Platform Links */}
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <a href="https://www.bugchase.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs sm:text-sm font-semibold text-blue-300 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all">
                <Globe className="w-4 h-4 text-blue-400" /> Web: www.bugchase.com <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
              <a href="https://api.bugchase.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs sm:text-sm font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all">
                <Server className="w-4 h-4 text-indigo-400" /> API: api.bugchase.com <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
              <a href="https://support.bugchase.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs sm:text-sm font-semibold text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all">
                <ShieldCheck className="w-4 h-4 text-purple-400" /> Support: support.bugchase.com <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            </div>
          </div>
        </div>

        {/* ── Slide 2: Introduction & Overview ───────────────────────────── */}
        <div ref={(el) => { slideRefs.current[1] = el; }} className="flex items-center justify-center h-screen min-h-screen max-h-screen px-4 sm:px-6 snap-start snap-always pt-20 pb-4 overflow-hidden">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">Introduction</h1>
            <p className="text-lg sm:text-xl text-blue-200 font-medium mb-5 max-w-3xl mx-auto leading-snug">
              Multi-role security platform connecting researchers, companies, triagers, support, and admins in one unified workflow.
            </p>

            {/* Pitch Banner */}
            <GlassCard className="mb-5 border-blue-500/30 bg-blue-950/20 py-3.5 px-6 text-center">
              <p className="text-base sm:text-lg md:text-xl text-blue-100 font-semibold leading-relaxed">
                &ldquo;Pakistan-focused crowdsourced security testing with AI-assisted triage, escrow payouts, and coordinated disclosure.&rdquo;
              </p>
            </GlassCard>

            {/* Roles Table Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 text-left">
              {[
                { role: "Researchers", icon: Shield, desc: "Find & report vulnerabilities, earn bounties, build reputation.", color: "text-blue-400" },
                { role: "Companies", icon: Building2, desc: "Run BBP / VDP programs, define scope, payout from Stripe escrow.", color: "text-emerald-400" },
                { role: "Triagers", icon: UserCheck, desc: "Validate severity & status, deduplicate with AI, converse via WebSocket.", color: "text-purple-400" },
                { role: "Support", icon: HelpCircle, desc: "Mediate disputes on support.bugchase.com, reassign triagers.", color: "text-amber-400" },
                { role: "Admins", icon: Lock, desc: "Govern platform users, programs moderation, finance & treasury.", color: "text-red-400" },
              ].map((item) => (
                <GlassCard key={item.role} className="flex flex-col gap-2 p-4 border-white/10 hover:border-white/20">
                  <div className="flex items-center gap-2.5">
                    <item.icon className={`w-5 h-5 ${item.color} shrink-0`} />
                    <h3 className="text-base sm:text-lg font-bold text-white">{item.role}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-200 leading-snug font-normal">{item.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* ── Slide 3: Problem Statement ──────────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[2] = el; }} className="flex items-center justify-center h-screen min-h-screen max-h-screen px-4 sm:px-6 snap-start snap-always pt-20 pb-4 overflow-hidden">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">Problem Statement</h1>
            <p className="text-lg sm:text-xl text-blue-200 font-medium mb-5">Traditional security testing in Pakistan is fragmented &amp; vulnerable.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 text-left mb-5">
              {[
                { title: "Expensive & Infrequent", desc: "Annual pentests miss continuous daily risk & zero-days." },
                { title: "Unstructured Disclosure", desc: "Researchers email bugs with no legal safe harbor or scope clarity." },
                { title: "Manual Triage Overload", desc: "Companies drown in duplicate reports and severity disputes." },
                { title: "Weak Trust & Payouts", desc: "No escrow guarantees, reputation gates, or KYC verification." },
                { title: "No Integrated Platform", desc: "Fragmented tools (email, spreadsheets) instead of one pipeline." },
              ].map((prob, i) => (
                <GlassCard key={prob.title} className="flex flex-col gap-2 p-4 border-red-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-red-400 font-bold">0{i + 1}.</span>
                    <h3 className="text-sm sm:text-base font-bold text-white">{prob.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-200 leading-snug">{prob.desc}</p>
                </GlassCard>
              ))}
            </div>

            {/* Core Problem Callout */}
            <GlassCard className="border-red-500/30 bg-red-950/20 p-5 text-left flex items-start gap-4">
              <ShieldAlert className="w-7 h-7 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-red-300 mb-1">Core Problem Summary</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-100 font-medium leading-relaxed">
                  There is no unified system that safely connects ethical hackers and organizations with scoped programs, AI-assisted triage, dispute handling, and PKR payouts.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* ── Slide 4: Proposed Solution - BugChase ───────────────────────── */}
        <div ref={(el) => { slideRefs.current[3] = el; }} className="flex items-center justify-center h-screen min-h-screen max-h-screen px-4 sm:px-6 snap-start snap-always pt-20 pb-4 overflow-hidden">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">Proposed Solution — BugChase</h1>
            <p className="text-lg sm:text-xl text-blue-200 font-medium mb-5">One end-to-end pipeline from discovery → report → triage → resolution → reward.</p>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left mb-5">
              {[
                { pillar: "Programs", built: "Public/private BBP & VDP with scope, rewards, safe harbor", icon: Target },
                { pillar: "Reports", built: "Guided submission (VRT taxonomy), attachments, spam guards", icon: FileText },
                { pillar: "AI Pipeline", built: "Duplicate detection + CVSS v3.1 triage after submission", icon: Bot },
                { pillar: "Human Triage", built: "Triager queue, claim, severity decisions, live WebSocket chat", icon: UserCheck },
                { pillar: "Money", built: "Company escrow (Stripe), researcher wallet & payouts (PKR)", icon: DollarSign },
                { pillar: "Trust", built: "KYC verification, reputation/profile gates, private invites", icon: BadgeCheck },
                { pillar: "Governance", built: "Admin moderation, support disputes portal, Hall of Fame", icon: ShieldCheck },
                { pillar: "Public Site", built: "Marketing site, public profiles (/h/:username), live stats", icon: Globe },
              ].map((item) => (
                <GlassCard key={item.pillar} className="flex flex-col gap-2 p-4 border-blue-500/20">
                  <div className="flex items-center gap-2.5 text-blue-400">
                    <item.icon className="w-5 h-5 shrink-0" />
                    <h3 className="text-base sm:text-lg font-bold text-white">{item.pillar}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-200 leading-snug">{item.built}</p>
                </GlassCard>
              ))}
            </div>

            <GlassCard className="border-emerald-500/30 bg-emerald-950/20 py-3 px-6 text-center">
              <p className="text-xs sm:text-sm md:text-base font-semibold text-emerald-300">
                ✓ Result: Complete ecosystem transforming security testing into an automated, transparent, and rewarding workflow.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* ── Slide 5: Scope of the Project ───────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[4] = el; }} className="flex items-center justify-center h-screen min-h-screen max-h-screen px-4 sm:px-6 snap-start snap-always pt-20 pb-4 overflow-hidden">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">Scope of the Project</h1>
            <p className="text-lg sm:text-xl text-blue-200 font-medium mb-5">Comprehensive scope boundaries and deployment architecture.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 text-left">
              {/* In Scope */}
              <GlassCard className="flex flex-col gap-3 border-emerald-500/20 p-5">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <h3 className="text-lg sm:text-xl font-bold text-white">In Scope</h3>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-200 leading-snug list-disc list-inside">
                  <li>Multi-role web apps (main + support portal)</li>
                  <li>REST API with JWT + 2FA + session revocation</li>
                  <li>Program management (BBP/VDP, private invites)</li>
                  <li>Report lifecycle + real-time chat (Socket.io)</li>
                  <li>AI modules: CVSS, duplicate engine, Gemini, KYC</li>
                  <li>Asset discovery microservice &amp; Stripe escrow</li>
                  <li>Public landing, legal pages, Hall of Fame</li>
                </ul>
              </GlassCard>

              {/* Out of Scope */}
              <GlassCard className="flex flex-col gap-3 border-amber-500/20 p-5">
                <div className="flex items-center gap-2.5 text-amber-400">
                  <XCircle className="w-6 h-6 shrink-0" />
                  <h3 className="text-lg sm:text-xl font-bold text-white">Out of Scope / Limitations</h3>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-200 leading-snug list-disc list-inside">
                  <li>Native mobile apps (iOS / Android)</li>
                  <li>Full legal liability insurance product</li>
                  <li>Guaranteed 100% AI accuracy (AI assists; humans decide)</li>
                  <li>Offline / air-gapped enterprise installation</li>
                </ul>
              </GlassCard>

              {/* Deployment Targets */}
              <GlassCard className="flex flex-col gap-3 border-blue-500/20 p-5">
                <div className="flex items-center gap-2.5 text-blue-400">
                  <Server className="w-6 h-6 shrink-0" />
                  <h3 className="text-lg sm:text-xl font-bold text-white">Deployment Targets</h3>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-gray-200 leading-snug">
                  <div>
                    <span className="font-semibold text-white">Hosting:</span> Client, Support Portal &amp; API deployed on <strong className="text-blue-300">Vercel</strong>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Databases:</span> <strong className="text-emerald-300">MongoDB Atlas</strong> (+ Search), <strong className="text-red-300">Upstash Redis</strong>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Integrations:</span> Cloudinary, Stripe, Gmail, Hugging Face Spaces
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* ── Slide 6: Capstone-I Feedback ────────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[5] = el; }} className="flex items-center justify-center h-screen min-h-screen max-h-screen px-4 sm:px-6 snap-start snap-always pt-20 pb-4 overflow-hidden">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">Capstone-I Feedback</h1>

            {/* Header Metadata Box */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-blue-500/10 border border-blue-500/30 px-6 py-2.5 rounded-xl mb-3 text-xs sm:text-sm font-sans font-medium text-white max-w-4xl mx-auto">
              <div>
                <span className="text-blue-300">Supervisor Name:</span> <strong className="text-white">Mam Sumbal Fatima</strong>
              </div>
              <span>•</span>
              <div>
                <span className="text-blue-300">Project Name:</span> <strong className="text-white">Bug Bounty Platform for Pakistan</strong>
              </div>
              <span>•</span>
              <div>
                <span className="text-blue-300">Score:</span> <strong className="text-amber-300 font-bold font-mono text-sm sm:text-base">11.75</strong>
              </div>
            </div>

            {/* Exact Transcribed Feedback Bullets */}
            <GlassCard className="p-4 sm:p-5 max-w-5xl mx-auto text-left border-blue-500/30">
              <ul className="space-y-2 text-xs sm:text-sm text-gray-200 leading-snug list-disc list-inside">
                {capstone1FeedbackBullets.map((bullet, idx) => (
                  <li key={idx} className="pl-1">
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </div>

        {/* ── Slide 7: Feedback Response and Justification ────────────────── */}
        <div ref={(el) => { slideRefs.current[6] = el; }} className="flex items-center justify-center h-screen min-h-screen max-h-screen px-4 sm:px-6 snap-start snap-always pt-20 pb-4 overflow-hidden">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">Feedback Response &amp; Justification</h1>
            <p className="text-lg sm:text-xl text-blue-200 font-medium mb-4">How Capstone-I evaluation points were directly addressed in Capstone-II.</p>

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="py-2.5 px-3 font-bold text-blue-300 uppercase tracking-wider">Capstone-I Feedback</th>
                    <th className="py-2.5 px-3 font-bold text-emerald-300 uppercase tracking-wider">Our Response in Capstone-II</th>
                    <th className="py-2.5 px-3 font-bold text-purple-300 uppercase tracking-wider">Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {[
                    { fb: "Strengthen server security & auth", resp: "JWT purpose (session vs 2fa_pending), logout Redis blacklist, password tokenVersion, private profile redaction", just: "UI-only checks are insufficient; API must strictly enforce policy" },
                    { fb: "Clearer role separation", resp: "Researcher / company / triager / support / admin routes + restrictTo middleware", just: "Prevent privilege confusion & vertical escalation" },
                    { fb: "AI / automation value", resp: "reportProcessingQueue → Atlas Search + duplicate_engine + cvss_engine", just: "Dramatically reduce triage load while keeping human oversight" },
                    { fb: "Completeness of product", resp: "Escrow payouts, dispute portal, KYC, private invites, Hall of Fame", just: "Elevate prototype to production-ready enterprise FYP" },
                    { fb: "Documentation", resp: "Expanded root README + AI microservices architecture guides", just: "Ensures reproducible deployment for examiners" },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 px-3 font-bold text-white">{row.fb}</td>
                      <td className="py-2.5 px-3 text-gray-200 leading-snug">{row.resp}</td>
                      <td className="py-2.5 px-3 text-gray-300 italic">{row.just}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <GlassCard className="py-3 px-6 text-center border-blue-500/30">
              <p className="text-xs sm:text-sm text-blue-200 font-mono font-medium">
                Closing Note: Capstone-II focused on deep security hardening, end-to-end financial/triage workflows, and AI assistance.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* ── Slide 8: System Roles and Responsibilities ──────────────────── */}
        <div ref={(el) => { slideRefs.current[7] = el; }} className="flex items-center justify-center h-screen min-h-screen max-h-screen px-4 sm:px-6 snap-start snap-always pt-20 pb-4 overflow-hidden">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">System Roles &amp; Responsibilities</h1>
            <p className="text-lg sm:text-xl text-blue-200 font-medium mb-4">Clear delegation of capabilities across all 7 platform actors.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="py-2.5 px-3 font-bold text-blue-300 uppercase tracking-wider w-40">Role</th>
                    <th className="py-2.5 px-3 font-bold text-gray-300 uppercase tracking-wider">Responsibilities</th>
                    <th className="py-2.5 px-3 font-bold text-emerald-300 uppercase tracking-wider w-44 text-center">Achieved Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {[
                    { role: "Researcher", resp: "Signup/2FA, profile + KYC, browse programs, submit reports, WebSocket chat, wallet/payouts, private invites", status: "Achieved", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
                    { role: "Company", resp: "Create BBP/VDP, asset discovery, review reports, award bounty from Stripe escrow, team settings", status: "Achieved", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
                    { role: "Triager", resp: "Queue/pool, claim reports, severity/status decisions, validation notices, Gemini AI summaries", status: "Achieved", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
                    { role: "Support", resp: "Dispute inbox on support.bugchase.com, message mediation, triager reassignment invites", status: "Achieved", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
                    { role: "Admin", resp: "Users & programs moderation, finance/treasury, global announcements, Hall of Fame management", status: "Achieved", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
                    { role: "Public Visitor", resp: "Landing page, solutions, legal pages, Hall of Fame, privacy-aware public profiles (/h/:username)", status: "Achieved", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
                    { role: "System / AI", resp: "Duplicate check, CVSS triage, KYC match, asset scan, emails & real-time notification dispatch", status: "Achieved (Configurable)", badge: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="py-2 px-3 font-bold text-white flex items-center gap-2 align-middle">
                        <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span> <span className="whitespace-nowrap">{row.role}</span>
                      </td>
                      <td className="py-2 px-3 text-gray-200 leading-snug align-middle">{row.resp}</td>
                      <td className="py-2 px-3 text-center align-middle whitespace-nowrap">
                        <div className="inline-flex flex-col items-center justify-center gap-0.5">
                          <span className={`px-2.5 py-0.5 rounded-full border text-xs font-mono font-semibold leading-none shadow-sm ${row.badge}`}>
                            {row.status.replace(' (Configurable)', '')}
                          </span>
                          {row.status.includes('(Configurable)') && (
                            <span className="text-[11px] font-mono text-blue-300 font-medium leading-tight mt-0.5">(Configurable)</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Slide 9: Completed Tasks Across Capstone Phases ─────────────── */}
        <div ref={(el) => { slideRefs.current[8] = el; }} className="flex items-center justify-center h-screen min-h-screen max-h-screen px-4 sm:px-6 snap-start snap-always pt-20 pb-4 overflow-hidden">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">Completed Tasks Across Capstone Phases</h1>
            <p className="text-lg sm:text-xl text-blue-200 font-medium mb-5">Evolution from core foundation to production-grade intelligence.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 text-left mb-4">
              <GlassCard className="flex flex-col gap-4 border-blue-500/30 p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-blue-400" /> Capstone-I Phase
                  </h3>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                    Foundation Focus
                  </span>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-gray-200 leading-relaxed">
                  <p><strong className="text-white">Core Architecture:</strong> Defined system roles, basic authentication, initial database models.</p>
                  <p><strong className="text-white">Program &amp; Report UI:</strong> Basic program browser and guided report submission wizard.</p>
                  <p><strong className="text-white">Initial API:</strong> Basic CRUD endpoints for users, reports, and company programs.</p>
                </div>
              </GlassCard>

              <GlassCard className="flex flex-col gap-4 border-emerald-500/30 p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-emerald-400" /> Capstone-II Phase
                  </h3>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    Hardening &amp; Intelligence
                  </span>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-gray-200 leading-relaxed">
                  <p><strong className="text-white">AI Processing Pipeline:</strong> Atlas Search + Duplicate Engine + CVSS Triage Engine.</p>
                  <p><strong className="text-white">Security Hardening:</strong> 2FA, JWT blacklist, tokenVersion, PII API redaction.</p>
                  <p><strong className="text-white">Production Completeness:</strong> Stripe escrow payouts, Support Portal, KYC space, Hall of Fame.</p>
                </div>
              </GlassCard>
            </div>

            <GlassCard className="py-3 px-6 text-center border-purple-500/30">
              <p className="text-xs sm:text-sm text-purple-200 font-mono font-medium">
                Detailed breakdowns split into Frontend, Backend, and ML/AI modules in subsequent slides.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* ── Slide 10: Completed Tasks - Frontend ────────────────────────── */}
        <div ref={(el) => { slideRefs.current[9] = el; }} className="flex items-center justify-center h-screen min-h-screen max-h-screen px-4 sm:px-6 snap-start snap-always pt-20 pb-4 overflow-hidden">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">Completed Tasks: Frontend</h1>
            <p className="text-lg sm:text-xl text-blue-200 font-medium mb-5">User interfaces &amp; interactive experience built across phases.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 text-left mb-5">
              <GlassCard className="flex flex-col gap-4 p-6">
                <h3 className="text-lg sm:text-xl font-bold text-blue-300 border-b border-white/10 pb-2.5">Capstone-I (Foundation)</h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-200 list-disc list-inside leading-snug">
                  <li>Role-based dashboards (researcher, company, triager, admin)</li>
                  <li>Authentication interfaces (Login, Signup, Email OTP)</li>
                  <li>Program browsing &amp; guided VRT report submission wizard</li>
                  <li>Basic user profiles and settings management</li>
                </ul>
              </GlassCard>

              <GlassCard className="flex flex-col gap-4 border-emerald-500/20 p-6">
                <h3 className="text-lg sm:text-xl font-bold text-emerald-300 border-b border-white/10 pb-2.5">Capstone-II (Productization)</h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-200 list-disc list-inside leading-snug">
                  <li>Support Portal (<span className="text-blue-300 font-mono">support.bugchase.com</span>) for dispute mediation</li>
                  <li>Public marketing site (Landing, Solutions, Company, Legal) with live stats</li>
                  <li>Hall of Fame &amp; privacy-aware public researcher profiles (<span className="text-blue-300 font-mono">/h/:username</span>)</li>
                  <li>Stripe Wallet / Escrow interface &amp; researcher KYC upload wizard</li>
                  <li>Real-time report WebSocket chat &amp; invite accept landing pages</li>
                  <li>Security UX: 2FA prompt step, submission score gate (&ge;150)</li>
                </ul>
              </GlassCard>
            </div>

            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-xs sm:text-sm font-mono text-gray-200">
              <Cpu className="w-4.5 h-4.5 text-blue-400" /> Stack: <strong className="text-white">React + Vite + TypeScript + Tailwind CSS + React Router</strong>
            </div>
          </div>
        </div>

        {/* ── Slide 11: Completed Tasks - Backend ─────────────────────────── */}
        <div ref={(el) => { slideRefs.current[10] = el; }} className="flex items-center justify-center h-screen min-h-screen max-h-screen px-4 sm:px-6 snap-start snap-always pt-20 pb-4 overflow-hidden">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">Completed Tasks: Backend</h1>
            <p className="text-lg sm:text-xl text-blue-200 font-medium mb-5">Server architecture, security enforcement, and integrations.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 text-left mb-5">
              <GlassCard className="flex flex-col gap-4 p-6">
                <h3 className="text-lg sm:text-xl font-bold text-blue-300 border-b border-white/10 pb-2.5">Capstone-I (Core API)</h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-200 list-disc list-inside leading-snug">
                  <li>Express API mounts (/auth, /users, /reports, /programs, /company, /triager, /admin)</li>
                  <li>Mongoose models (User, Report, Program, Transaction)</li>
                  <li>JWT authentication &amp; basic role restrictTo middleware</li>
                  <li>Basic report CRUD and company program management</li>
                </ul>
              </GlassCard>

              <GlassCard className="flex flex-col gap-4 border-purple-500/20 p-6">
                <h3 className="text-lg sm:text-xl font-bold text-purple-300 border-b border-white/10 pb-2.5">Capstone-II (Hardening &amp; Scale)</h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-200 list-disc list-inside leading-snug">
                  <li>Full auth suite: 2FA pending tokens, Redis logout revocation, tokenVersion</li>
                  <li>Public signup role lockdown (no self-assigning triager/admin)</li>
                  <li>Server-side report eligibility enforcement (&ge;150 score threshold)</li>
                  <li>Private profile API redaction &amp; serial reportProcessingQueue</li>
                  <li>Stripe escrow transactions &amp; dispute management API</li>
                  <li>Socket.io report rooms, Cloudinary, Nodemailer, Gemini &amp; KYC integration</li>
                </ul>
              </GlassCard>
            </div>

            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-xs sm:text-sm font-mono text-gray-200">
              <Server className="w-4.5 h-4.5 text-emerald-400" /> Stack: <strong className="text-white">Node.js + Express + Mongoose + Upstash Redis + Socket.io</strong>
            </div>
          </div>
        </div>

        {/* ── Slide 12: ML / AI Module ────────────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[11] = el; }} className="flex items-center justify-center h-screen min-h-screen max-h-screen px-4 sm:px-6 snap-start snap-always pt-20 pb-4 overflow-hidden">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">ML / AI Module</h1>
            <p className="text-lg sm:text-xl text-blue-200 font-medium mb-5">Intelligent automation assisting vulnerability triage and security ops.</p>

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="py-2.5 px-3 font-bold text-blue-300 uppercase tracking-wider">Module</th>
                    <th className="py-2.5 px-3 font-bold text-gray-300 uppercase tracking-wider">Tech Stack</th>
                    <th className="py-2.5 px-3 font-bold text-gray-300 uppercase tracking-wider">Role in BugChase</th>
                    <th className="py-2.5 px-3 font-bold text-emerald-300 uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {[
                    { name: "Duplicate Engine", tech: "FastAPI + Ollama (Foundation-Sec)", role: "Determines if new report duplicates previously submitted bugs", status: "Implemented" },
                    { name: "CVSS Engine", tech: "FastAPI + Ollama + cvss lib", role: "Suggests CVSS v3.1 vector & severity rating post-submit", status: "Implemented" },
                    { name: "Atlas Search", tech: "MongoDB Atlas Search", role: "First-pass candidate discovery for similar reports", status: "Implemented" },
                    { name: "Gemini 2.5 Flash", tech: "Google Generative AI", role: "Generates triager summaries & company message drafts", status: "Implemented" },
                    { name: "KYC Engine", tech: "FastAPI on Hugging Face", role: "Face & ID card verification for researchers", status: "Hosted (HF Space)" },
                    { name: "Asset Discovery", tech: "FastAPI + Celery", role: "Subdomain & port discovery microservice for company assets", status: "Optional Service" },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="py-2 px-3 font-bold text-white flex items-center gap-2">
                        <Bot className="w-4 h-4 text-blue-400 shrink-0" /> {row.name}
                      </td>
                      <td className="py-2 px-3 font-mono text-blue-300">{row.tech}</td>
                      <td className="py-2 px-3 text-gray-200 leading-snug">{row.role}</td>
                      <td className="py-2 px-3 text-center font-mono text-emerald-400 font-bold whitespace-nowrap">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <GlassCard className="py-3 px-6 text-center border-amber-500/30 bg-amber-950/10">
              <p className="text-xs sm:text-sm text-amber-200 font-semibold flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" /> Important Examiner Note: AI assists triage; final decisions remain with human triagers &amp; companies.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* ── Slide 13: Tools and Technologies ───────────────────────────── */}
        <div ref={(el) => { slideRefs.current[12] = el; }} className="flex items-center justify-center h-screen min-h-screen max-h-screen px-4 sm:px-6 snap-start snap-always pt-20 pb-4 overflow-hidden">
          <div className="max-w-5xl w-full text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">Tools &amp; Technologies</h1>
            <p className="text-lg sm:text-xl text-blue-200 font-medium mb-5">Modern full-stack tech stack driving performance and security.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {[
                { layer: "Frontend Layer", tech: "React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query", icon: Cpu, color: "text-blue-400" },
                { layer: "Backend Layer", tech: "Node.js, Express, Mongoose, JWT, Helmet, CORS, Socket.io", icon: Server, color: "text-emerald-400" },
                { layer: "Databases & Cache", tech: "MongoDB Atlas (+ Atlas Search), Upstash Redis", icon: Database, color: "text-purple-400" },
                { layer: "AI / ML Engine", tech: "FastAPI, Ollama, Foundation-Sec, Gemini API, EasyOCR / DeepFace (KYC Space)", icon: Brain, color: "text-amber-400" },
                { layer: "Payments & Financials", tech: "Stripe Wallet & Escrow Integration", icon: CreditCard, color: "text-indigo-400" },
                { layer: "Cloud Services & Infra", tech: "Vercel (Client, Support, API), Cloudinary, Nodemailer, Hugging Face Spaces", icon: Globe, color: "text-red-400" },
              ].map((item) => (
                <GlassCard key={item.layer} className="flex flex-col gap-2.5 p-5">
                  <div className="flex items-center gap-2.5">
                    <item.icon className={`w-5 h-5 ${item.color} shrink-0`} />
                    <h3 className="text-base sm:text-lg font-bold text-white">{item.layer}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-200 font-mono leading-snug">{item.tech}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* ── Slide 14: Conclusion & References ──────────────────────────── */}
        <div ref={(el) => { slideRefs.current[13] = el; }} className="flex items-center justify-center h-screen min-h-screen max-h-screen px-4 sm:px-6 snap-start snap-always pt-20 pb-4 overflow-hidden">
          <div className="max-w-5xl w-full text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">Conclusion &amp; References</h1>
            <p className="text-lg sm:text-xl text-blue-200 font-medium max-w-3xl mx-auto leading-snug">
              BugChase successfully delivers a production-grade crowdsourced security platform tailored for Pakistan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto text-left">
              <GlassCard className="flex flex-col gap-3 p-5 border-blue-500/30">
                <CheckCircle2 className="w-7 h-7 text-blue-400 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-white">Full-Stack Completeness</h3>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  End-to-end implementation covering user auth, program creation, report lifecycle, WebSocket chat, escrow, and dispute management.
                </p>
              </GlassCard>

              <GlassCard className="flex flex-col gap-3 p-5 border-emerald-500/30">
                <Bot className="w-7 h-7 text-emerald-400 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-white">AI-Assisted Triage</h3>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  FastAPI microservices delivering duplicate detection, CVSS v3.1 estimation, and generative summaries while empowering human decisions.
                </p>
              </GlassCard>

              <GlassCard className="flex flex-col gap-3 p-5 border-purple-500/30">
                <FileText className="w-7 h-7 text-purple-400 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-white">Project README Note</h3>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  Detailed environment setup, microservice guides, and architecture references are available in the project README.
                </p>
              </GlassCard>
            </div>

            {/* Final Q&A Callout */}
            <div className="pt-2">
              <div className="relative flex justify-center mb-3">
                <div className="absolute inset-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-pulse mx-auto"></div>
                <div className="w-16 h-16 rounded-full border border-white/10 bg-black/60 flex items-center justify-center relative shadow-2xl">
                  <span className="text-3xl text-blue-400 font-mono animate-pulse">?</span>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">Questions &amp; Discussion</h2>
              <p className="text-gray-300 text-xs sm:text-sm font-mono tracking-widest uppercase mt-2 font-semibold">
                Thank you for your time · BugChase Capstone-II Team
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Image / Diagram Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
          style={{ zIndex: 9999 }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            className="absolute top-6 right-6 text-white hover:text-blue-400 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-[92vw] max-h-[92vh] p-4 flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <Image src={selectedImage.src} alt={selectedImage.alt} width={1200} height={800} className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain border border-white/10" />
            <p className="text-sm text-gray-300 font-mono">{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </div>
  );
}