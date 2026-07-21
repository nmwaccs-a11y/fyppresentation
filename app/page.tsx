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

const InteractiveCipher = dynamic(() => import("@/components/InteractiveCipher"), {
  ssr: false,
});

const InteractiveDecryption = dynamic(() => import("@/components/InteractiveDecryption"), {
  ssr: false,
});

const PythonPlaygroundSlide = dynamic(() => import("@/components/PythonPlaygroundSlide"), {
  ssr: false,
});

const slides = [
  { id: 0, title: "Title",        name: "Title Slide" },
  { id: 1, title: "Context",      name: "Origins and Architecture" },
  { id: 2, title: "Mechanic",     name: "Standard Columnar vs. Myszkowski" },
  { id: 3, title: "Encryption",   name: "Encryption Algorithm in Action" },
  { id: 4, title: "Decryption",   name: "Decryption Algorithm in Action" },
  { id: 5, title: "Python",       name: "Python Implementation & Live Execution" },
  { id: 6, title: "Cryptanalysis",name: "Cryptanalysis" },
  { id: 7, title: "Q&A",          name: "Questions & Discussion" },
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

        {/* Slide 1: Title */}
        <div ref={(el) => { slideRefs.current[0] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full text-center space-y-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 mb-6 pb-2 leading-tight drop-shadow-2xl font-sans">
                The Myszkowski Transposition
              </h1>
              <p className="text-2xl md:text-3xl text-blue-200 font-medium tracking-wide">
                Algorithmic disruption of standard columnar cryptography.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
              {[
                'Shahzaib',
                'Tuaseef Ahmad',
                'Shahzaib Ahmad',
                'Qasim Mehar (Arain)',
              ].map((name) => (
                <GlassCard key={name} className="flex items-center gap-3 py-4 px-6">
                  <BadgeCheck className="w-5 h-5 text-blue-400 shrink-0" />
                  <p className="text-base text-gray-200 whitespace-nowrap">{name}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Slide 2: Origins and Architecture */}
        <div ref={(el) => { slideRefs.current[1] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Origins and Architecture</h1>
            <p className="text-xl text-blue-300 mb-12">Historical Context &amp; Purpose</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Origin</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Introduced in 1902 by Émile Victor Théodore Myszkowski. A <em>pure transposition cipher</em> — it scrambles character positions without substituting them.
                </p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-8 h-8 text-red-400" />
                  <h3 className="text-xl font-bold text-white">The Core Problem</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Standard Columnar Transposition reads each column entirely top-to-bottom, leaving <strong className="text-white">contiguous vertical plaintext chunks</strong> intact — trivially vulnerable to anagramming attacks.
                </p>
              </GlassCard>
              <GlassCard className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-8 h-8 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">The Solution</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  By assigning <strong className="text-white">identical ranks</strong> to duplicate keyword letters, Myszkowski forces those columns to be read <em>concurrently</em> — left-to-right, row-by-row — fracturing the contiguous chunks.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Slide 3: The Core Mechanic */}
        <div ref={(el) => { slideRefs.current[2] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Standard Columnar vs. Myszkowski</h1>
            <p className="text-xl text-blue-300 mb-12">The Core Mechanic comparison with keyword APPLE</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <GlassCard className="flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Standard Columnar</h3>
                  <div className="space-y-3">
                    <p className="text-gray-300"><strong className="text-white">Rule:</strong> Duplicate letters in the key are ranked sequentially (e.g., in APPLE, P1 is 2, P2 is 3).</p>
                    <p className="text-gray-300"><strong className="text-white">Extraction:</strong> Read entirely vertically, column by column.</p>
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 font-mono text-sm text-gray-400">
                  <div className="text-[10px] text-gray-500 mb-2 tracking-wider uppercase text-center">Standard Ranking Mapping</div>
                  <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center bg-white/[0.03] border border-white/[0.08] rounded p-2 w-12">
                      <span className="text-white font-bold">A</span>
                      <span className="text-blue-400 text-xs mt-1">1</span>
                    </div>
                    <div className="flex flex-col items-center bg-blue-500/10 border border-blue-500/20 rounded p-2 w-12">
                      <span className="text-blue-300 font-bold">P₁</span>
                      <span className="text-blue-400 text-xs mt-1">2</span>
                    </div>
                    <div className="flex flex-col items-center bg-blue-500/10 border border-blue-500/20 rounded p-2 w-12">
                      <span className="text-blue-300 font-bold">P₂</span>
                      <span className="text-blue-400 text-xs mt-1">3</span>
                    </div>
                    <div className="flex flex-col items-center bg-white/[0.03] border border-white/[0.08] rounded p-2 w-12">
                      <span className="text-white font-bold">L</span>
                      <span className="text-blue-400 text-xs mt-1">4</span>
                    </div>
                    <div className="flex flex-col items-center bg-white/[0.03] border border-white/[0.08] rounded p-2 w-12">
                      <span className="text-white font-bold">E</span>
                      <span className="text-blue-400 text-xs mt-1">5</span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">The Myszkowski Variant</h3>
                  <div className="space-y-3">
                    <p className="text-gray-300"><strong className="text-white">Rule:</strong> Duplicate letters share the exact same rank (e.g., in APPLE, both P's are 2).</p>
                    <p className="text-gray-300"><strong className="text-white">Extraction:</strong> Columns with the same rank are read concurrently—transcribed left-to-right, row-by-row.</p>
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 font-mono text-sm text-gray-400">
                  <div className="text-[10px] text-gray-500 mb-2 tracking-wider uppercase text-center">Myszkowski Ranking Mapping</div>
                  <div className="flex justify-center gap-2">
                    <div className="flex flex-col items-center bg-white/[0.03] border border-white/[0.08] rounded p-2 w-12">
                      <span className="text-white font-bold">A</span>
                      <span className="text-emerald-400 text-xs mt-1">1</span>
                    </div>
                    <div className="flex flex-col items-center bg-emerald-500/10 border border-emerald-500/20 rounded p-2 w-12">
                      <span className="text-emerald-300 font-bold">P</span>
                      <span className="text-emerald-400 text-xs mt-1">2</span>
                    </div>
                    <div className="flex flex-col items-center bg-emerald-500/10 border border-emerald-500/20 rounded p-2 w-12">
                      <span className="text-emerald-300 font-bold">P</span>
                      <span className="text-emerald-400 text-xs mt-1">2</span>
                    </div>
                    <div className="flex flex-col items-center bg-white/[0.03] border border-white/[0.08] rounded p-2 w-12">
                      <span className="text-white font-bold">L</span>
                      <span className="text-emerald-400 text-xs mt-1">3</span>
                    </div>
                    <div className="flex flex-col items-center bg-white/[0.03] border border-white/[0.08] rounded p-2 w-12">
                      <span className="text-white font-bold">E</span>
                      <span className="text-emerald-400 text-xs mt-1">4</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Slide 4: Encryption */}
        <div ref={(el) => { slideRefs.current[3] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Encryption Algorithm in Action</h1>
            <p className="text-xl text-blue-300 mb-8 font-mono">Click 'Next Step' or press [SPACEBAR] to step through encryption</p>
            <InteractiveCipher />
          </div>
        </div>

        {/* Slide 5: Decryption */}
        <div ref={(el) => { slideRefs.current[4] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Decryption Algorithm in Action</h1>
            <p className="text-xl text-blue-300 mb-8 font-mono">Click 'Next Step' or press [SPACEBAR] to step through decryption</p>
            <InteractiveDecryption />
          </div>
        </div>

        {/* Slide 6: Python Playground */}
        <div ref={(el) => { slideRefs.current[5] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-7xl w-full text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Python Implementation</h1>
            <p className="text-xl text-blue-300 mb-8">Live execution powered by WebAssembly · Press <span className="font-mono bg-white/[0.06] px-2 py-0.5 rounded-lg text-sm">Ctrl+Enter</span> to run</p>
            <PythonPlaygroundSlide />
          </div>
        </div>

        {/* Slide 7: Cryptanalysis (Strengths & Weaknesses) */}
        <div ref={(el) => { slideRefs.current[6] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Cryptanalysis: Strengths &amp; Weaknesses</h1>
            <p className="text-xl text-blue-300 mb-12">Security Analysis</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <GlassCard className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">Strengths</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <h4 className="font-semibold text-white mb-1">Disrupts Anagramming</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      The primary strength lies in shattering the intact vertical column chunks that standard columnar ciphers leave behind. Reading duplicate-rank columns concurrently row-by-row significantly increases the mathematical complexity of reconstruction through anagramming attacks.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Simple Key Management</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Works with any natural-language keyword containing repeating letters — no special key generation required, making it practical for manual use.
                    </p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-8 h-8 text-red-400" />
                  <h3 className="text-xl font-bold text-white">Vulnerabilities</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <h4 className="font-semibold text-white mb-1">Zero Confusion</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      As a <em>pure transposition</em> cipher it only provides diffusion. Letter frequencies remain identical to the underlying plaintext language, leaving it highly vulnerable to frequency analysis — a cryptanalyst can immediately identify the plaintext language and rule out substitution.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Multiple Anagramming</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      If a sender reuses the same keyword for multiple messages of the <em>exact same length</em>, an attacker can compare ciphertexts to derive column lengths and eventually recover the transposition key entirely.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Slide 8: Q&A */}
        <div ref={(el) => { slideRefs.current[7] = el; }} className="flex items-center justify-center min-h-screen px-4 snap-start snap-always pt-20">
          <div className="max-w-6xl w-full text-center space-y-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Questions &amp; Discussion</h1>
            <p className="text-2xl text-blue-200 font-medium">Thank you for your time.</p>
            <div className="relative flex justify-center mt-8">
              <div className="absolute inset-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl animate-pulse mx-auto"></div>
              <div className="w-24 h-24 rounded-full border border-white/10 bg-black/60 flex items-center justify-center relative shadow-2xl">
                <span className="text-4xl text-sky-400 font-mono animate-pulse">?</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-mono tracking-widest uppercase mt-4">
              decryption stream online &bull; presenter listening
            </p>
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