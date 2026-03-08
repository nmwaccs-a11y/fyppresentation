'use client';
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import GlassNavbar from "@/components/GlassNavbar";

// Lucide Icons Imports
import {
  UserPlus,
  MailCheck,
  ShieldCheck,
  CreditCard,
  ScanFace,
  ShieldAlert,
  BadgeCheck,
  ListChecks,
  Briefcase,
  Link,
  LayoutDashboard,
  Calculator,
  BarChart3,
  FileEdit,
  ImagePlus,
  Tag,
  MessageSquare,
  Send,
  Building2,
  Lock,
  RefreshCw,
  FileText,
  Megaphone,
  UserX,
  UserCog,
  Search,
  Target,
  Activity,
  Server,
  Shield,
  Database,
  Layers,
  Zap,
  Cpu,
  UserCheck,
  Upload,
  MessageCircle,
  UserCircle,
  Award,
  AlertCircle,
  Lightbulb,
  Quote,
  CheckCircle,
  Clock,
  Flag,
  Map,
  Globe,
  Sliders,
  Bot,
  Trophy,
  Brain,
  Scale,
  DollarSign
} from "lucide-react";

const LightRays = dynamic(() => import("@/components/LightRays"), {
  ssr: false,
});

const slides = [
  { id: 0, title: "Identity", name: "Project Title & Team Identity" },
  { id: 1, title: "Intro", name: "Project Introduction" },
  { id: 2, title: "Feedback", name: "FYP Panel Feedback" },
  { id: 3, title: "Scope", name: "Strategic Scope Enhancements" },
  { id: 4, title: "Roles", name: "Roles & Responsibilities" },
  { id: 5, title: "Comparative", name: "Comparative Analysis" },
  { id: 6, title: "Milestones", name: "Milestone Implementation Overview" },
  { id: 7, title: "KYC", name: "Advanced Researcher KYC" },
  { id: 8, title: "Researcher", name: "Actor – Researcher" },
  { id: 9, title: "Company", name: "Actor – Company" },
  { id: 10, title: "Triager", name: "Actor – Triager" },
  { id: 11, title: "Admin", name: "Actor – Administrator" },
  { id: 12, title: "Shared", name: "Unified Communication & Shared Logic" },
  { id: 13, title: "Backend", name: "Technical Architecture (Backend)" },
  { id: 14, title: "Frontend", name: "Technical Architecture (Frontend)" },
  { id: 15, title: "Roadmap", name: "Roadmap to Capstone 2" },
  { id: 16, title: "Summary", name: "Conclusion & Project Summary" },
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

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;

        const heading = slide.querySelector('h1');
        const subContent = slide.querySelectorAll('p, h2, ul, ol, .content-box');

        if (heading) {
          gsap.fromTo(heading,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
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
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
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

    // Ensure index is valid
    if (index < 0 || index >= slides.length) return;

    const slideElement = slideRefs.current[index];
    if (slideElement && containerRef.current) {
      isScrolling.current = true;
      const gsap = (await import("gsap")).default;

      gsap.to(containerRef.current, {
        scrollTo: { y: slideElement, autoKill: false },
        duration: 1.2,
        ease: "power4.inOut",
        onComplete: () => {
          isScrolling.current = false;
          setCurrentSlide(index);
        }
      });

      setCurrentSlide(index);
    }
  }, []);

  const handleNavClick = useCallback((index: number, item: any) => {
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
    <div className={`backdrop-blur-md bg-white/[0.02] p-8 sm:p-10 md:p-12 rounded-[2rem] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.05)] ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="relative min-h-screen w-full" style={{ backgroundColor: '#000000' }}>
      {/* Background */}
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

      {/* Navigation */}
      <GlassNavbar items={navItems} activeIndex={currentSlide} onItemClick={handleNavClick} />

      {/* Pages */}
      <div
        ref={containerRef}
        data-scroll-container
        className="relative overflow-y-auto overflow-x-hidden h-screen snap-y snap-mandatory scroll-smooth"
        style={{ scrollBehavior: 'smooth', zIndex: 10 }}
      >

        {/* Slide 1: Project Title & Team */}
        <div ref={(el) => { slideRefs.current[0] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full text-center space-y-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 mb-6 pb-2 leading-tight drop-shadow-2xl">
                BugChase
              </h1>
              <p className="text-2xl md:text-3xl text-blue-200 font-medium tracking-wide">
                Pakistan's First Bug Bounty Platform
              </p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard className="flex flex-col items-center justify-center gap-4 hover:bg-white/[0.05] transition-colors">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                  <UserCircle className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Muhammad Qasim</h3>
                </div>
              </GlassCard>
              <GlassCard className="flex flex-col items-center justify-center gap-4 hover:bg-white/[0.05] transition-colors">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                  <UserCircle className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Shahzaib</h3>
                </div>
              </GlassCard>
              <GlassCard className="flex flex-col items-center justify-center gap-4 hover:bg-white/[0.05] transition-colors">
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-2">
                  <UserCircle className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Shahzaib Ahmad</h3>
                </div>
              </GlassCard>
              <GlassCard className="flex flex-col items-center justify-center gap-4 hover:bg-white/[0.05] transition-colors">
                <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mb-2">
                  <UserCircle className="w-8 h-8 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Tauseef Ahmad</h3>
                </div>
              </GlassCard>
            </div>

            <GlassCard className="max-w-2xl mx-auto flex items-center justify-center gap-4 py-6">
              <BadgeCheck className="w-8 h-8 text-emerald-400" />
              <p className="text-xl text-gray-200">
                <span className="font-semibold text-white mr-2">Supervision:</span>
                Madam Sumbal Fatima
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Slide 2: Project Introduction */}
        <div ref={(el) => { slideRefs.current[1] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Project Introduction</h1>
            <h2 className="text-2xl md:text-3xl text-blue-400 font-semibold mb-12">BugChase</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-red-400" />
                  <h3 className="text-xl font-bold text-white">Mission</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">To bridge the trust gap between Pakistani enterprises and the ethical hacking community by providing a secure, localized vulnerability disclosure ecosystem.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Purpose</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">To minimize cyber risks for local organizations through crowdsourced security, while fostering a high-trust professional environment for independent researchers.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Layers className="w-8 h-8 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Scope of Project</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">A robust, multi-tenant platform featuring KYC-verified onboarding, an automated asset discovery engine, and a logic-driven triage system for report lifecycle management.</p>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Slide 3: FYP Panel Feedback */}
        <div ref={(el) => { slideRefs.current[2] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">FYP Panel Feedback</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">Observations</h3>
                </div>
                <ul className="list-disc pl-5 space-y-3 text-gray-300 leading-relaxed">
                  <li>Project idea is unique & valid.</li>
                  <li>Scope requires refinement & clarity.</li>
                  <li>Work is currently too external/API-heavy.</li>
                </ul>
              </GlassCard>

              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="w-8 h-8 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Suggestions</h3>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed text-sm">
                  <li>Add RAG for basic queries and assistance for both companies and researchers.</li>
                  <li>Introduce competitions for researchers to resolve bugs with additional rewards.</li>
                  <li>Automate detection of duplicate bug reports.</li>
                  <li>Include basic scanning tools within the system to provide assistance.</li>
                  <li>Connect the working of the triage team for better visualization.</li>
                  <li>Handle cyber laws and associated penalties through the system.</li>
                </ul>
              </GlassCard>

              <GlassCard className="flex flex-col gap-4 justify-center bg-white/[0.04]">
                <div className="flex items-center gap-3 mb-2">
                  <Quote className="w-8 h-8 text-indigo-400" />
                  <h3 className="text-xl font-bold text-white">Panel Verdict</h3>
                </div>
                <p className="text-gray-300 italic text-lg leading-relaxed">
                  "At least four new suggestions or features should be explicitly included... Students must focus on system-oriented tasks rather than just integration."
                </p>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Slide 4: Strategic Scope Enhancements */}
        <div ref={(el) => { slideRefs.current[3] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 text-center">Strategic Scope Enhancements</h1>
            <p className="text-xl text-blue-300 text-center mb-12">Technical Evolution & System-Oriented Tasks</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <Sliders className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Rule-Based Duplicate Detection</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">High-precision logic engine (CWE Mapping, Endpoint Validation) instead of generic AI to identify redundant reports.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <Scale className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Cyber Law & Penalty Integration</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Dedicated legal compliance module for policy enforcement and automated penalties (suspension/reputation loss).</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <Globe className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Automated Asset Discovery</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Microservice executing Subfinder/Nmap scans to populate "Potential Assets" for companies.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <Map className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Triage Lifecycle Visualization</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Specialized module visualizing the transparent roadmap of the report validation process.</p>
                </div>
              </GlassCard>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-300 italic">"Research-Backed Logic: Statuses and metrics grounded in established cybersecurity frameworks."</p>
            </div>
          </div>
        </div>

        {/* Slide 5: Roles & Responsibilities */}
        <div ref={(el) => { slideRefs.current[4] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-7xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 text-center">Roles & Responsibilities</h1>
            <p className="text-xl text-blue-300 text-center mb-10">Actor-Module Mapping</p>

            <GlassCard className="overflow-hidden p-0 sm:p-0 md:p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="p-4 md:p-6 font-bold text-white text-lg min-w-[150px]">Module</th>
                      <th className="p-4 md:p-6 font-bold text-blue-400 text-lg min-w-[200px] border-l border-white/10">Researcher</th>
                      <th className="p-4 md:p-6 font-bold text-teal-400 text-lg min-w-[200px] border-l border-white/10">Company</th>
                      <th className="p-4 md:p-6 font-bold text-purple-400 text-lg min-w-[200px] border-l border-white/10">Triager</th>
                      <th className="p-4 md:p-6 font-bold text-red-400 text-lg min-w-[200px] border-l border-white/10">Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 md:p-6 font-bold text-gray-200">Authentication & KYC</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Complete NIC verification & Facenet512 Liveliness check.</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Onboard business entity & verify domain ownership.</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Review researcher identity disputes (if escalated).</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Global oversight of user status and role assignments.</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors bg-white/[0.01]">
                      <td className="p-4 md:p-6 font-bold text-gray-200">Asset & Scope</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Hunt for vulnerabilities only within the defined "In-Scope" assets.</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Define digital boundaries and utilize Auto-Discovery tools.</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Validate if a report matches the specific asset endpoint.</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Manage global asset categories and system limits.</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 md:p-6 font-bold text-gray-200">Bounty & Reporting</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Use built-in CVSS 3.1 to assess and submit technical POCs.</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Review validated bugs and approve reward payouts.</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Execute Duplicate Detection logic and map findings to CWE.</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Oversee the platform-wide audit logs and dispute resolution.</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors bg-white/[0.01]">
                      <td className="p-4 md:p-6 font-bold text-gray-200">Communication</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Direct engagement with triagers via the Tripartite Thread.</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Participate in active chat to clarify fix requirements.</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Moderate the thread and provide technical summaries to the company.</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Broadcast platform-wide alerts and maintenance notices.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Slide 6: Comparative Analysis */}
        <div ref={(el) => { slideRefs.current[5] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-7xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 text-center">Comparative Analysis</h1>
            <p className="text-xl text-blue-300 text-center mb-10">Global Bug Bounty Platforms vs BugChase</p>

            <GlassCard className="overflow-hidden p-0 sm:p-0 md:p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="p-4 md:p-6 font-bold text-white text-lg min-w-[150px]">Platform</th>
                      <th className="p-4 md:p-6 font-bold text-blue-400 text-lg min-w-[120px] border-l border-white/10">Country</th>
                      <th className="p-4 md:p-6 font-bold text-purple-400 text-lg min-w-[300px] border-l border-white/10">Challenges for Pakistani Users</th>
                      <th className="p-4 md:p-6 font-bold text-emerald-400 text-lg min-w-[250px] border-l border-white/10">Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 md:p-6 font-bold text-gray-200">HackerOne</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">USA</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Requires international bank or PayPal; 30–40% reward loss due to dual taxation. High competition causes duplicate reports.</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Excellent global scope but inaccessible to Pakistani researchers.</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors bg-white/[0.01]">
                      <td className="p-4 md:p-6 font-bold text-gray-200">Bugcrowd</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">USA</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Demands legal agreements under US law; limited inclusion of Pakistan-based companies; foreign payouts only.</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Complex onboarding and unsuitable for local financial systems.</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 md:p-6 font-bold text-gray-200">Intigriti</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Belgium</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Euro-only payments; no Pakistani programs; not compliant with local laws.</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Great European platform, but geographically restrictive.</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors bg-white/[0.01]">
                      <td className="p-4 md:p-6 font-bold text-gray-200">Synack</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">USA</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Invite-only; focused on Western clients; requires background verification and NDAs.</td>
                      <td className="p-4 md:p-6 text-gray-400 text-sm border-l border-white/10">Designed for elite researchers, not local contributors.</td>
                    </tr>
                    <tr className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 hover:from-blue-900/30 hover:to-indigo-900/30 transition-colors border-t border-blue-500/30">
                      <td className="p-4 md:p-6 font-bold text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        BugChase <span className="text-xs font-normal text-blue-300 ml-1">(Proposed)</span>
                      </td>
                      <td className="p-4 md:p-6 text-gray-200 text-sm font-semibold border-l border-white/10">Pakistan</td>
                      <td className="p-4 md:p-6 text-gray-200 text-sm border-l border-white/10">Legally safe under PECA; direct local payouts via JazzCash, Easypaisa, or Bank; smaller community reduces duplicates.</td>
                      <td className="p-4 md:p-6 text-white text-sm font-medium border-l border-white/10">First legal, local, and secure bridge for Pakistani cybersecurity.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Slide 7: Milestone Implementation Overview */}
        <div ref={(el) => { slideRefs.current[6] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center drop-shadow-lg">Milestone Implementation Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-blue-400" />
                  <h3 className="text-2xl font-bold text-white">Current Phase</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">More than 30% functional implementation of the project’s total requirements.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-red-400" />
                  <h3 className="text-2xl font-bold text-white">Core Objective</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">Establishing the essential "Researcher-to-Company" lifecycle with high-security standards.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                  <h3 className="text-2xl font-bold text-white">Key Achievements</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">Successful deployment of identity verification (KYC), tripartite chat, and the technical submission engine.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-8 h-8 text-purple-400" />
                  <h3 className="text-2xl font-bold text-white">Functional Modules</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">Authentication, Identity Management, Reporting Engine, Communication Thread, and Administrative Tools.</p>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Slide 8: Advanced Researcher KYC */}
        <div ref={(el) => { slideRefs.current[7] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">Advanced Researcher KYC</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">NIC-Based Authentication</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">Secure collection and verification of National Identity Card (NIC) data to ensure platform accountability.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <ScanFace className="w-8 h-8 text-indigo-400" />
                  <h3 className="text-xl font-bold text-white">Biometric Liveliness Detection</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">Integration of the Facenet512 model for real-time face matching to prevent identity spoofing.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-8 h-8 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Anti-Fraud Layer</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">System logic that differentiates between live human presence and digital reproductions (photos/videos) during the onboarding process.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="w-8 h-8 text-teal-400" />
                  <h3 className="text-xl font-bold text-white">Trust Badge</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">Automated assignment of a "Verified" badge upon successful identity and biometric validation.</p>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Slide 9: Actor – Researcher */}
        <div ref={(el) => { slideRefs.current[8] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">Actor – Researcher</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <UserCircle className="w-6 h-6 text-blue-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Profile & Portfolio</h3>
                  <p className="text-gray-300 leading-relaxed">Functional management of technical skills and experience, linked with professional accounts (GitHub/LinkedIn) to generate a public portfolio.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <Search className="w-6 h-6 text-purple-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Program Discovery</h3>
                  <p className="text-gray-300 leading-relaxed">Ability to filter and search security programs by industry tags and categories.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <Send className="w-6 h-6 text-emerald-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Submission Engine</h3>
                  <p className="text-gray-300 leading-relaxed">Standardized form for bug reporting with integrated Cloudinary support for technical evidence (images/videos).</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <Calculator className="w-6 h-6 text-amber-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Self-Assessment Tools</h3>
                  <p className="text-gray-300 leading-relaxed">Access to a built-in CVSS v3.1 calculator to propose vulnerability severity scores during submission.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <LayoutDashboard className="w-6 h-6 text-cyan-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Personal Dashboard</h3>
                  <p className="text-gray-300 leading-relaxed">Real-time tracking of report status history and progress from submission to resolution.</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Slide 10: Actor – Company */}
        <div ref={(el) => { slideRefs.current[9] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">Actor – Company</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <Building2 className="w-6 h-6 text-teal-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Business Profile & Verification</h3>
                  <p className="text-gray-300 leading-relaxed">Creation of business identities and functional domain ownership verification to ensure platform legitimacy.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <Target className="w-6 h-6 text-red-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Scope Management</h3>
                  <p className="text-gray-300 leading-relaxed">Specialized interface to define "In-Scope" and "Out-of-Scope" assets, guiding researcher efforts away from restricted environments.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-indigo-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Program Control</h3>
                  <p className="text-gray-300 leading-relaxed">Full capability to launch Public or Private Vulnerability Disclosure Programs (VDP) and Bug Bounty Programs (BBP).</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <FileText className="w-6 h-6 text-blue-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Review & Approval</h3>
                  <p className="text-gray-300 leading-relaxed">Interface to review triaged reports, participate in communication threads, and approve or reject validated findings.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-green-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Reward Definition</h3>
                  <p className="text-gray-300 leading-relaxed">Ability to set and manage reward tiers based on vulnerability severity.</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Slide 11: Actor – Triager */}
        <div ref={(el) => { slideRefs.current[10] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">Actor – Triager</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <LayoutDashboard className="w-6 h-6 text-blue-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Triage Dashboard</h3>
                  <p className="text-gray-300 leading-relaxed">A dedicated queue management system to view, claim, and organize incoming bug reports.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <ShieldAlert className="w-6 h-6 text-yellow-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Validation Tools</h3>
                  <p className="text-gray-300 leading-relaxed">Built-in CVSS calculator and standardized CWE mapping to categorize and score reports accurately.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-teal-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Communication Hub</h3>
                  <p className="text-gray-300 leading-relaxed">Full access to the unified tripartite thread to post comments, request info, and share attachments with researchers.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <RefreshCw className="w-6 h-6 text-purple-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Workflow Management</h3>
                  <p className="text-gray-300 leading-relaxed">Capability to generate summary reviews and transition reports through the state machine (Pending, Resolved, Duplicate, etc.).</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Slide 12: Actor – Administrator */}
        <div ref={(el) => { slideRefs.current[11] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">Actor – Administrator</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <Lock className="w-6 h-6 text-red-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Platform Governance</h3>
                  <p className="text-gray-300 leading-relaxed">High-level dashboard for user management, including the ability to suspend or ban malicious actors.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <UserPlus className="w-6 h-6 text-green-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Staff Onboarding</h3>
                  <p className="text-gray-300 leading-relaxed">Secure workflow for inviting and onboarding Triagers and assigning specific technical roles.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <Megaphone className="w-6 h-6 text-blue-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Global Broadcast System</h3>
                  <p className="text-gray-300 leading-relaxed">System-wide messaging capability to send high-priority alerts and maintenance updates to all platform users.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <Shield className="w-6 h-6 text-indigo-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Access Control</h3>
                  <p className="text-gray-300 leading-relaxed">Implementation of Role-Based Access Control (RBAC) to enforce security and data isolation across all actors.</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Slide 13: Unified Communication */}
        <div ref={(el) => { slideRefs.current[12] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">Unified Communication</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-indigo-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Tripartite Communication</h3>
                  <p className="text-gray-300 leading-relaxed">A real-time, shared communication thread accessible by Researchers, Triagers, and Companies for every report.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <MailCheck className="w-6 h-6 text-pink-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Integrated Notification System</h3>
                  <p className="text-gray-300 leading-relaxed">Automated email and platform notifications for thread updates and status changes.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <Activity className="w-6 h-6 text-cyan-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">State Machine Logic</h3>
                  <p className="text-gray-300 leading-relaxed">Centralized backend logic managing the complex transitions of bug reports to ensure data integrity.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex gap-4">
                <div className="flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-amber-300 mt-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Global Leaderboard</h3>
                  <p className="text-gray-300 leading-relaxed">A research-backed ranking system based on verified user stats and regional filters to foster healthy competition.</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>



        {/* Slide 14: Technical Architecture (Backend) */}
        <div ref={(el) => { slideRefs.current[13] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">Technical Architecture (Backend)</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Server className="w-8 h-8 text-green-400" />
                  <h3 className="text-xl font-bold text-white">Platform Backbone</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">High-performance API architecture built on Node.js and the Express.js framework.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Security Layer</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">Advanced bcrypt-based hashing for credentials and secure session token encryption.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Database className="w-8 h-8 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Data Layer</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">MongoDB utilized for flexible, metadata-rich storage of vulnerability reports and user identities.</p>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Slide 15: Technical Architecture (Frontend) */}
        <div ref={(el) => { slideRefs.current[14] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">Technical Architecture (Frontend)</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassCard className="flex flex-col items-center text-center gap-4">
                <Layers className="w-12 h-12 text-cyan-400" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Interface Layer</h3>
                  <p className="text-gray-300 leading-relaxed">React.js framework used to build highly responsive and real-time dashboards for all system actors.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex flex-col items-center text-center gap-4">
                <Zap className="w-12 h-12 text-yellow-400" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Real-time Updates</h3>
                  <p className="text-gray-300 leading-relaxed">Integration of WebSocket or similar technologies to handle instant chat notifications and status changes.</p>
                </div>
              </GlassCard>
              <GlassCard className="flex flex-col items-center text-center gap-4">
                <Cpu className="w-12 h-12 text-pink-400" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">CVSS Logic</h3>
                  <p className="text-gray-300 leading-relaxed">Client-side implementation of CVSS scoring libraries for accurate, real-time severity calculations.</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Slide 16: Roadmap to Capstone 2 */}
        <div ref={(el) => { slideRefs.current[15] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">Roadmap to Capstone 2</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Brain className="w-8 h-8 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">AI-Driven Vulnerability Analysis</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">Shifting from manual triage to automated similarity rules for duplicate detection and AI-generated CVSS scoring.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-8 h-8 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Automated Asset Discovery</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">Transitioning from mock simulations to a functional Kali Linux microservice executing Subfinder, Nmap, and Shodan scans.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-green-400" />
                  <h3 className="text-xl font-bold text-white">Financial & Escrow Ecosystem</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">Implementation of the secure transaction ledger and escrow wallets to automate bounty payouts and company deposits.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">Advanced Gamification</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">Deploying complex weighted scoring logic and automated reputation deduction for out-of-scope violations.</p>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Slide 17: Conclusion & Project Summary */}
        <div ref={(el) => { slideRefs.current[16] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">Conclusion & Project Summary</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Infrastructure Stability</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">Successfully established a robust foundation with 52 fully functional requirements covering end-to-end bug reporting and secure user management.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-indigo-400" />
                  <h3 className="text-xl font-bold text-white">Verified Ecosystem</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">Integrated a high-level identity trust system through the KYC engine, NIC verification, and liveliness detection.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-green-400" />
                  <h3 className="text-xl font-bold text-white">Active Communication</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">The tripartite thread and real-time status tracker are fully operational, enabling seamless interaction between Researchers, Triagers, and Companies.</p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Flag className="w-8 h-8 text-amber-400" />
                  <h3 className="text-xl font-bold text-white">Project Vision</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">BugChase is now positioned to move from a manual vulnerability disclosure platform to a fully automated, AI-enhanced security marketplace for Pakistan.</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {
        selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
            style={{ zIndex: 9999 }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              className="absolute top-4 right-4 text-white hover:text-blue-400 p-2 rounded-full bg-black/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative max-w-[95vw] max-h-[95vh] p-4" onClick={(e) => e.stopPropagation()}>
              <Image src={selectedImage.src} alt={selectedImage.alt} width={1200} height={800} className="max-w-full max-h-[95vh] rounded-lg shadow-2xl object-contain" />
            </div>
          </div>
        )
      }
    </div >
  );
}