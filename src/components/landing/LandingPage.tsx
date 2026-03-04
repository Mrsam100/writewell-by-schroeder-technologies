/** @license SPDX-License-Identifier: Apache-2.0 */
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, Zap, ArrowRight, ArrowUpRight,
  Linkedin, Mail, MessageSquare, Twitter, FileText, Globe,
  Briefcase, PenTool, Megaphone, BarChart3, Code, Scale, Users,
  Menu, X, Star, Check, Mic
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { C, MODE_COLORS, MODES } from "../../constants";
import { Logo } from "../common/Logo";
import { LiveDemo } from "./LiveDemo";
import { useGsapAnimations } from "../../hooks/useGsapAnimations";
import { useAuth } from "../../contexts/AuthContext";

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const onLaunchApp = () => navigate(user ? "/app" : "/login");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeUseCase, setActiveUseCase] = useState(0);
  const landingRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);

  useGsapAnimations(landingRef, heroTextRef, true);

  const useCases = [
    { title: "WriteWell for Executives", desc: "Your board reports, investor updates, and internal comms—rewritten with executive authority. Lead with conclusions, cut the fluff, sound like the leader you are.", before: "I wanted to give you an update on the project status and let you know about some issues we've been facing recently.", after: "Project velocity has dropped 20%. Root cause: resource allocation. Proposed fix: redistribute Q3 budget. Decision needed by Friday." },
    { title: "WriteWell for Creators", desc: "Blog posts, newsletters, and social content that actually connects. Less corporate, more human. Your authentic voice, amplified.", before: "I'm sharing some tips about productivity that I think could be really helpful for you to improve your workflow.", after: "Here's the truth about productivity nobody wants to admit: most 'hacks' are just procrastination in disguise. What actually works?" },
    { title: "WriteWell for Marketers", desc: "Landing pages, ad copy, and campaigns that convert. Every word engineered for persuasion without sounding desperate.", before: "Our product is really good and has a lot of features that customers will find useful for their daily work.", after: "47% of teams waste 3 hours daily on communication friction. One tool eliminates it. See what changes when every message lands." },
    { title: "WriteWell for Sales", desc: "Proposals, follow-ups, and outreach that close deals. Sound confident, not pushy. Build desire before you ask.", before: "I wanted to follow up on our meeting and see if you had any questions about our solution.", after: "You mentioned your team loses 15 hours/week to manual reporting. Here's exactly how we eliminate that—and what 3 similar teams achieved in 30 days." },
    { title: "WriteWell for Developers", desc: "Documentation, PRs, and technical writing that humans actually read. Clear, precise, no jargon unless it serves the reader.", before: "This PR implements a new caching layer that uses Redis to improve performance of the API endpoints.", after: "Adds Redis caching to /api/users and /api/products. Result: 94% fewer DB queries, p99 latency drops from 800ms → 45ms. See benchmarks below." },
    { title: "WriteWell for Lawyers", desc: "Client communications, briefs, and memos that are precise yet accessible. Authority without unnecessary legalese.", before: "Pursuant to our previous discussion regarding the contractual obligations set forth in the agreement, we believe that the party in question may be in breach.", after: "Based on Section 4.2 of the agreement, the counterparty has missed two consecutive payment deadlines. This constitutes breach. Recommended next step: formal notice by March 15." },
    { title: "WriteWell for Leaders", desc: "Team communications, strategy docs, and all-hands messaging that inspires action. Sound decisive, empathetic, and clear.", before: "I want to let everyone know about some changes that will be happening soon that might affect some of you.", after: "Starting April 1, we're restructuring into three focused squads. Here's why, what changes for you, and how we'll support the transition." },
  ];

  const testimonials = [
    { quote: "WriteWell has completely changed how I communicate with my board. My reports are sharper, more authoritative, and significantly more persuasive.", author: "Elena Rossi", role: "CEO, FinTech Global", color: "from-[#d8b4fe] to-[#a855f7]" },
    { quote: "The LinkedIn platform mode is a game-changer. It understands the algorithm and the audience psychology. My engagement has tripled.", author: "Marcus Chen", role: "Founder, GrowthLab", color: "from-[#fb6340] to-[#f5365c]" },
    { quote: "Finally, an AI tool that doesn't sound like a robot. The Warmth mode is incredibly human and has helped me build better client relationships.", author: "Sarah Jenkins", role: "Creative Director", color: "from-[#2dce89] to-[#0f3d2e]" },
    { quote: "I'm afraid I'm getting addicted to this platform. It allows me to get into a flow state and not have autocorrect interrupt while I'm articulating my ideas.", author: "Alex Rivera", role: "Author & Business Coach", color: "from-[#11cdef] to-[#5e72e4]" },
    { quote: "You're making professional writing actually delightful right now! Can see it becoming a can't-live-without product fast.", author: "Tara Tan", role: "Founding Partner, Strange Ventures", color: "from-[#8965e0] to-[#d8b4fe]" },
    { quote: "This is the best AI product I've used since ChatGPT. The authority mode transformed my executive summaries completely.", author: "Rahul Vohra", role: "CEO, Superhuman", color: "from-[#f5365c] to-[#fb6340]" },
  ];

  return (
    <div ref={landingRef} className="relative z-10">
      {/* ── NAVBAR ── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] nav-pill rounded-full px-3 py-2 flex items-center gap-1 max-w-4xl w-[95%]">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 px-3 hover:opacity-70 transition-opacity">
          <Logo size={28} />
          <span style={{ fontFamily: C.serif }} className="text-[20px] font-bold tracking-tight">WriteWell</span>
        </button>

        <div className="hidden md:flex items-center gap-1 ml-4">
          {["Features", "Pricing"].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="px-4 py-2 text-[14px] font-medium opacity-60 hover:opacity-100 transition-opacity rounded-full hover:bg-black/[0.03]">
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {user ? (
            <button onClick={() => navigate("/app")} className="pill-btn pill-btn-lavender text-[13px] py-2 px-5 font-semibold">
              Launch App
            </button>
          ) : (
            <>
              <Link to="/login" className="hidden sm:flex pill-btn pill-btn-outline text-[13px] py-2 px-5">
                Sign In
              </Link>
              <Link to="/register" className="pill-btn pill-btn-lavender text-[13px] py-2 px-5 font-semibold">
                Sign Up
              </Link>
            </>
          )}
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-full hover:bg-black/5">
            {mobileMenu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl border border-black/[0.05] p-6 shadow-xl"
            >
              <div className="flex flex-col gap-3">
                {["Features", "Pricing"].map(link => (
                  <a key={link} href={`#${link.toLowerCase()}`} className="text-[17px] font-medium py-2" onClick={() => setMobileMenu(false)}>{link}</a>
                ))}
                {user ? (
                  <button onClick={() => { navigate("/app"); setMobileMenu(false); }} className="w-full py-3 rounded-full bg-[#d8b4fe] text-black font-semibold text-[15px] mt-2">
                    Launch App
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenu(false)} className="text-[17px] font-medium py-2">Sign In</Link>
                    <Link to="/register" onClick={() => setMobileMenu(false)} className="w-full py-3 rounded-full bg-[#d8b4fe] text-black font-semibold text-[15px] mt-2 text-center block">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO SECTION ── */}
      <section ref={heroRef} className="min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 relative overflow-hidden" style={{ backgroundColor: C.cream }}>
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[8%] w-64 h-64 bg-[#d8b4fe]/10 rounded-full blur-[80px] -z-10 gsap-parallax"
          data-speed="0.3"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -3, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-[#fb6340]/8 rounded-full blur-[100px] -z-10 gsap-parallax"
          data-speed="0.2"
        />
        <motion.div
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] right-[5%] w-48 h-48 bg-[#2dce89]/8 rounded-full blur-[60px] -z-10"
        />

        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-[#d8b4fe] -z-10"
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -100 - i * 30, 0],
              x: [0, (i % 2 ? 20 : -20), 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="max-w-5xl w-full text-center space-y-8 relative z-10">
          <motion.h1
            ref={heroTextRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="leading-[0.95] tracking-[-0.02em]"
            style={{ fontFamily: C.serif }}
          >
            <span className="text-[52px] md:text-[80px] lg:text-[110px] font-normal">
              {"Don't just write,".split("").map((ch, i) => (
                <span key={i} className="char-anim inline-block" style={{ display: ch === " " ? "inline" : undefined }}>
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
            <br />
            <span className="text-[52px] md:text-[80px] lg:text-[110px] font-bold italic gradient-text-shimmer">
              {"WriteWell.".split("").map((ch, i) => (
                <span key={`b-${i}`} className="char-anim inline-block">
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="max-w-2xl mx-auto text-[18px] md:text-[22px] leading-relaxed font-light"
            style={{ color: C.muted }}
          >
            The AI writing engine that transforms your words<br className="hidden md:block" />
            into strategic impact, in every context.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLaunchApp}
              className="pill-btn pill-btn-lavender text-[16px] px-8 py-3.5 font-semibold shadow-lg shadow-purple-300/20 glow-lavender"
            >
              <Zap size={18} />
              Try WriteWell
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pill-btn pill-btn-outline text-[16px] px-8 py-3.5"
            >
              Learn more
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-[13px] font-medium pt-2"
            style={{ color: C.dim }}
          >
            Trusted by 10,000+ professionals
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-20 px-4 max-w-5xl"
        >
          <div className="rounded-3xl border border-black/[0.08] bg-white shadow-2xl shadow-black/5 overflow-hidden">
            <div className="p-8 md:p-12">
              <LiveDemo />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── DARK SHOWCASE SECTION ── */}
      <section className="py-32 md:py-40 px-6 relative overflow-hidden" style={{ backgroundColor: C.dark }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 gsap-slide-left">
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: <Linkedin size={14} />, label: "LinkedIn" },
                  { icon: <Mail size={14} />, label: "Email" },
                  { icon: <MessageSquare size={14} />, label: "Slack" },
                  { icon: <Twitter size={14} />, label: "Twitter" },
                  { icon: <FileText size={14} />, label: "Proposals" },
                  { icon: <Globe size={14} />, label: "Blog" },
                ].map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#fcfaf2]/20 text-[#fcfaf2]/80 text-[13px] font-medium hover:bg-[#fcfaf2]/5 transition-colors cursor-default"
                  >
                    {p.icon}
                    {p.label}
                  </motion.div>
                ))}
              </div>

              <h2
                className="text-[38px] md:text-[52px] lg:text-[64px] font-bold leading-[1.05] tracking-tight"
                style={{ fontFamily: C.serif, color: C.cream }}
              >
                Transform your writing in every app, for any audience
              </h2>

              <p className="text-[17px] leading-relaxed max-w-lg" style={{ color: "rgba(252,250,242,0.6)" }}>
                Seamless writing intelligence that adapts to your platform, audience, and intent.
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onLaunchApp}
                className="pill-btn pill-btn-outline-cream text-[15px] px-7 py-3"
              >
                See it in action
                <ArrowRight size={16} />
              </motion.button>
            </div>

            <div className="gsap-slide-right relative">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-3xl border border-[#fcfaf2]/15 bg-[#1a1a1a] p-8 space-y-6 relative overflow-hidden shimmer-card border-glow-anim tilt-hover"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d8b4fe]/40 to-transparent" />
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/30 block mb-2">Original</span>
                    <p className="text-[14px] text-white/50 italic leading-relaxed">
                      "We are excited to announce our new product which will help you save time and money and improve efficiency."
                    </p>
                  </div>
                  <div className="flex justify-center py-2">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="w-10 h-10 rounded-full bg-[#d8b4fe]/20 flex items-center justify-center"
                    >
                      <Sparkles size={18} className="text-[#d8b4fe]" />
                    </motion.div>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#d8b4fe]/10 border border-[#d8b4fe]/20">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#d8b4fe] block mb-2">Authority Mode</span>
                    <p className="text-[14px] text-white font-medium leading-relaxed">
                      "Stop bleeding resources. Our new engine eliminates operational friction, reclaiming 40% of your team's productive capacity."
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -right-2 top-[20%] px-3 py-1.5 rounded-full bg-[#fb6340] text-white text-[11px] font-semibold shadow-lg"
                >
                  Stronger opening
                </motion.div>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -left-2 bottom-[25%] px-3 py-1.5 rounded-full bg-[#2dce89] text-white text-[11px] font-semibold shadow-lg"
                >
                  Enhanced clarity
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BANNER ── */}
      <section className="py-16 relative overflow-hidden" style={{ backgroundColor: C.teal }}>
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <p className="text-center text-[18px] md:text-[22px] italic" style={{ fontFamily: C.serif, color: "#fcfaf2" }}>
            Used by professionals everywhere to elevate their writing
          </p>
        </div>
        <div className="space-y-6 overflow-hidden">
          <div className="marquee-track">
            {[...Array(2)].map((_, setIdx) => (
              ["TechCorp", "StartupX", "ConsultFirm", "MediaGroup", "FinanceHub", "LegalPro", "GrowthLab", "DataSync"].map((name, i) => (
                <span
                  key={`${setIdx}-${i}`}
                  className="text-[28px] md:text-[36px] font-bold tracking-tight whitespace-nowrap opacity-40"
                  style={{ fontFamily: C.serif, color: "#fcfaf2" }}
                >
                  {name}
                </span>
              ))
            ))}
          </div>
          <div className="marquee-track-reverse">
            {[...Array(2)].map((_, setIdx) => (
              ["InnovateCo", "BrightPath", "NexGen", "CloudBase", "StrategyLab", "VelocityHQ", "PrimeSuite", "ScaleForce"].map((name, i) => (
                <span
                  key={`r-${setIdx}-${i}`}
                  className="text-[22px] md:text-[28px] font-bold tracking-tight whitespace-nowrap opacity-25"
                  style={{ fontFamily: C.serif, color: "#fcfaf2" }}
                >
                  {name}
                </span>
              ))
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS / VALUE PROPOSITION ── */}
      <section className="py-32 md:py-40 px-6" style={{ backgroundColor: C.cream }}>
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="gsap-scale-rotate text-[48px] md:text-[72px] lg:text-[96px] font-bold leading-[1] tracking-tight" style={{ fontFamily: C.serif }}>
            <span className="gsap-counter" data-target="10" data-suffix="x">0x</span>{" "}
            <span className="squiggle-underline">more impactful</span>
          </h2>
          <p className="gsap-reveal text-[17px] md:text-[20px] leading-relaxed max-w-2xl mx-auto" style={{ color: C.muted }}>
            Most AI tools fix your grammar. WriteWell fixes your <em style={{ fontFamily: C.serif }}>impact</em>.
            When you write with strategic intent, every word works harder. Speak naturally and let WriteWell transform your draft into polished, powerful communication.
          </p>
          <div className="gsap-reveal flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLaunchApp}
              className="pill-btn pill-btn-outline text-[15px] px-7 py-3"
            >
              <Mic size={16} />
              Try WriteWell
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLaunchApp}
              className="pill-btn pill-btn-lavender text-[15px] px-7 py-3 font-semibold"
            >
              Launch App
            </motion.button>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="max-w-5xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 gsap-stagger-parent">
          <motion.div
            whileHover={{ y: -4 }}
            className="gsap-stagger-child rounded-3xl border border-black/[0.06] bg-white p-8 md:p-10 space-y-4"
          >
            <span className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: C.muted }}>Generic AI</span>
            <h3 className="text-[28px] font-bold" style={{ fontFamily: C.serif }}>45 wpm</h3>
            <p className="text-[15px] leading-relaxed" style={{ color: C.muted }}>
              "We are excited to announce our new product which will help you save time and money and improve your overall workflow efficiency."
            </p>
            <div className="h-1 bg-black/5 rounded-full overflow-hidden">
              <div className="h-full w-[35%] bg-black/10 rounded-full score-bar-fill" />
            </div>
          </motion.div>
          <motion.div
            whileHover={{ y: -4 }}
            className="gsap-stagger-child rounded-3xl border border-[#d8b4fe]/30 bg-gradient-to-br from-[#1a1a1a] to-[#2a1a3a] p-8 md:p-10 space-y-4 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d8b4fe]/60 to-transparent" />
            <span className="text-[13px] font-semibold uppercase tracking-wider text-[#d8b4fe]">WriteWell</span>
            <h3 className="text-[28px] font-bold text-white" style={{ fontFamily: C.serif }}>220 wpm</h3>
            <p className="text-[15px] leading-relaxed text-white/80 font-medium">
              "Stop bleeding resources. Our new engine eliminates operational friction, reclaiming 40% of your team's productive capacity."
            </p>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[92%] bg-[#d8b4fe] rounded-full score-bar-fill" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── USE CASES SECTION ── */}
      <section className="py-32 md:py-40 px-6 relative overflow-hidden" style={{ backgroundColor: C.dark }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-10 gsap-reveal">
              <h2 className="text-[42px] md:text-[64px] font-bold leading-[1.05]" style={{ fontFamily: C.serif, color: C.cream }}>
                WriteWell is made{" "}
                <span style={{ color: C.lavender }}>for you</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: <Briefcase size={14} />, label: "Executives" },
                  { icon: <PenTool size={14} />, label: "Creators" },
                  { icon: <Megaphone size={14} />, label: "Marketers" },
                  { icon: <BarChart3 size={14} />, label: "Sales" },
                  { icon: <Code size={14} />, label: "Developers" },
                  { icon: <Scale size={14} />, label: "Lawyers" },
                  { icon: <Users size={14} />, label: "Leaders" },
                ].map((uc, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveUseCase(i)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-300 ${
                      activeUseCase === i
                        ? "bg-[#d8b4fe] text-black"
                        : "border border-[#fcfaf2]/20 text-[#fcfaf2]/70 hover:bg-[#fcfaf2]/5"
                    }`}
                  >
                    {uc.icon}
                    {uc.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="gsap-reveal">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeUseCase}
                  initial={{ opacity: 0, x: 20, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <h3 className="text-[28px] md:text-[36px] font-bold" style={{ fontFamily: C.serif, color: C.cream }}>
                    {useCases[activeUseCase].title}
                  </h3>
                  <p className="text-[16px] leading-relaxed" style={{ color: "rgba(252,250,242,0.6)" }}>
                    {useCases[activeUseCase].desc}
                  </p>
                  <div className="rounded-2xl border border-[#fcfaf2]/10 bg-[#1a1a1a] overflow-hidden">
                    <div className="p-5 border-b border-white/5">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Before</span>
                      <p className="text-[14px] text-white/40 italic mt-2 leading-relaxed">{useCases[activeUseCase].before}</p>
                    </div>
                    <div className="p-5 bg-[#d8b4fe]/5">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#d8b4fe]">After — WriteWell</span>
                      <p className="text-[14px] text-white font-medium mt-2 leading-relaxed">{useCases[activeUseCase].after}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section id="features" className="py-32 md:py-40 px-6" style={{ backgroundColor: C.cream }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4 gsap-blur-in">
            <h2 className="text-[42px] md:text-[64px] font-bold tracking-tight" style={{ fontFamily: C.serif }}>
              Everything you need to write well
            </h2>
            <p className="text-[17px] max-w-xl mx-auto" style={{ color: C.muted }}>
              Engineered for those who understand that every word is a tactical decision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gsap-stagger-parent">
            {/* Feature 1: AI Rewrite Engine */}
            <div className="gsap-stagger-child space-y-4 text-center">
              <h3 className="text-[28px] font-bold" style={{ fontFamily: C.serif }}>AI Rewrite Engine</h3>
              <p className="text-[15px] max-w-sm mx-auto" style={{ color: C.muted }}>
                Speak naturally and WriteWell transforms your draft into polished, powerful text. Rambled thoughts become clear communication.
              </p>
              <motion.div
                whileHover={{ y: -4, rotateY: -2, rotateX: 1 }}
                className="rounded-3xl bg-[#1a1a1a] p-6 space-y-4 min-h-[280px] relative overflow-hidden shimmer-card border-glow-anim border border-[#d8b4fe]/10"
                style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d8b4fe]/30 to-transparent" />
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[12px] text-white/40 italic">uh so I think we should probably reach out to the client about the deadline thing...</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#fb6340] text-white text-[9px] font-bold">Removed filler</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#2dce89] text-white text-[9px] font-bold">Fixed structure</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                      <Sparkles size={16} className="text-[#d8b4fe]" />
                    </motion.div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#d8b4fe]/10 border border-[#d8b4fe]/20">
                    <p className="text-[12px] text-white font-medium">We need to contact the client regarding the Q3 deadline. Proposed message and timeline attached.</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Feature 2: Strategic Modes */}
            <div className="gsap-stagger-child space-y-4 text-center">
              <h3 className="text-[28px] font-bold" style={{ fontFamily: C.serif }}>Strategic Modes</h3>
              <p className="text-[15px] max-w-sm mx-auto" style={{ color: C.muted }}>
                Six distinct rewriting lenses. Switch between Authority, Warmth, or Executive modes instantly.
              </p>
              <motion.div
                whileHover={{ y: -4, rotateY: 2, rotateX: -1 }}
                className="rounded-3xl bg-[#1a1a1a] p-6 min-h-[280px] flex flex-col items-center justify-center gap-4 shimmer-card border border-[#d8b4fe]/10"
                style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
              >
                <div className="flex flex-wrap gap-2 justify-center">
                  {MODES.map((m, i) => (
                    <motion.div
                      key={m}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                      className="px-4 py-2 rounded-full text-[12px] font-bold uppercase tracking-wider border"
                      style={{
                        borderColor: MODE_COLORS[m] + "40",
                        color: MODE_COLORS[m],
                        backgroundColor: MODE_COLORS[m] + "15",
                      }}
                    >
                      {m}
                    </motion.div>
                  ))}
                </div>
                <p className="text-[11px] text-white/30 mt-2">One message. Six strategic variations.</p>
              </motion.div>
            </div>

            {/* Feature 3: AI Audit Suite */}
            <div className="gsap-stagger-child space-y-4 text-center">
              <h3 className="text-[28px] font-bold" style={{ fontFamily: C.serif }}>AI Audit Suite</h3>
              <p className="text-[15px] max-w-sm mx-auto" style={{ color: C.muted }}>
                Deep-scan your writing for readability, clarity, authority, and engagement. Get actionable scores.
              </p>
              <motion.div
                whileHover={{ y: -4, rotateY: -2, rotateX: 1 }}
                className="rounded-3xl bg-[#1a1a1a] p-6 min-h-[280px] space-y-4 shimmer-card border border-[#d8b4fe]/10"
                style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
              >
                {[
                  { label: "Readability", value: 87, color: C.green },
                  { label: "Clarity", value: 92, color: "#d8b4fe" },
                  { label: "Authority", value: 78, color: C.amber },
                  { label: "Engagement", value: 85, color: "#11cdef" },
                ].map((s, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/40 uppercase tracking-wider font-medium">{s.label}</span>
                      <span className="text-white/80 font-bold">{s.value}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <span className="px-2 py-1 rounded-full bg-[#f5365c]/20 text-[#f5365c] text-[9px] font-bold">2 issues found</span>
                  <span className="px-2 py-1 rounded-full bg-[#fb6340]/20 text-[#fb6340] text-[9px] font-bold">1 buzzword</span>
                </div>
              </motion.div>
            </div>

            {/* Feature 4: Platform Intelligence */}
            <div className="gsap-stagger-child space-y-4 text-center">
              <h3 className="text-[28px] font-bold" style={{ fontFamily: C.serif }}>Platform Intelligence</h3>
              <p className="text-[15px] max-w-sm mx-auto" style={{ color: C.muted }}>
                WriteWell automatically adjusts tone based on your target platform. LinkedIn ≠ Email ≠ Slack.
              </p>
              <motion.div
                whileHover={{ y: -4, rotateY: 2, rotateX: -1 }}
                className="rounded-3xl bg-[#1a1a1a] p-6 min-h-[280px] flex flex-col items-center justify-center gap-6 shimmer-card border border-[#d8b4fe]/10"
                style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <PenTool size={24} className="text-white" />
                  </div>
                  <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] pointer-events-none" viewBox="0 0 300 200">
                    <motion.line x1="150" y1="100" x2="50" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} />
                    <motion.line x1="150" y1="100" x2="150" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }} />
                    <motion.line x1="150" y1="100" x2="250" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} />
                    <motion.line x1="150" y1="100" x2="70" y2="170" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.6 }} />
                    <motion.line x1="150" y1="100" x2="230" y2="170" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.7 }} />
                  </svg>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-6">
                  {[
                    { icon: <Linkedin size={12} />, name: "LinkedIn" },
                    { icon: <Mail size={12} />, name: "Email" },
                    { icon: <MessageSquare size={12} />, name: "Slack" },
                    { icon: <Twitter size={12} />, name: "Twitter" },
                    { icon: <Globe size={12} />, name: "Blog" },
                  ].map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-white/60 text-[11px] font-medium"
                    >
                      {p.icon}
                      {p.name}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-32 md:py-40 px-6 relative overflow-hidden" style={{ backgroundColor: C.dark }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 gsap-blur-in relative">
            <svg className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] opacity-20" viewBox="0 0 300 150">
              {[...Array(12)].map((_, i) => (
                <motion.line
                  key={i}
                  x1="150" y1="150"
                  x2={150 + Math.cos((i * Math.PI) / 11 - Math.PI / 2) * 140}
                  y2={150 + Math.sin((i * Math.PI) / 11 - Math.PI / 2) * 140}
                  stroke="#d8b4fe"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.6 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.08, ease: "easeOut" }}
                />
              ))}
            </svg>
            <h2 className="text-[42px] md:text-[64px] font-bold italic" style={{ fontFamily: C.serif, color: C.cream }}>
              Love letters to WriteWell
            </h2>
            <p className="text-[15px] mt-4" style={{ color: "rgba(252,250,242,0.4)" }}>
              Hear from professionals who transformed their writing
            </p>
          </div>

          {/* Infinite scrolling testimonial carousel — GSAP driven */}
          <div
            className="overflow-hidden py-8 -mx-6"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
            }}
          >
            <div className="testimonial-track-infinite flex items-center" style={{ gap: '24px' }}>
              {[...Array(3)].flatMap((_, setIdx) =>
                testimonials.map((t, i) => (
                  <div
                    key={`t-${setIdx}-${i}`}
                    className="testimonial-item w-[320px] flex-shrink-0 rounded-3xl p-8 space-y-5 flex flex-col"
                    style={{ backgroundColor: C.cream, transformOrigin: 'center center' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-[16px] shadow-lg`}>
                        {t.author[0]}
                      </div>
                      <div>
                        <p className="font-bold text-[14px]" style={{ color: C.text }}>{t.author}</p>
                        <p className="text-[12px]" style={{ color: C.muted }}>{t.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={14} className="fill-[#d8b4fe] text-[#d8b4fe]" />
                      ))}
                    </div>
                    <p className="text-[14px] leading-relaxed flex-1" style={{ color: C.text }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 gsap-stagger-parent">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="gsap-stagger-child rounded-3xl p-8 flex items-start justify-between"
              style={{ backgroundColor: C.teal }}
            >
              <div>
                <h3 className="text-[28px] md:text-[36px] font-bold italic" style={{ fontFamily: C.serif, color: C.cream }}>
                  10x more impactful
                </h3>
                <p className="text-[14px] mt-2" style={{ color: "rgba(252,250,242,0.6)" }}>
                  The "surprisingly powerful" writing assistant.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-[11px] font-bold">G</div>
                  <div>
                    <p className="text-[13px] font-medium" style={{ color: C.cream }}>Gaurav Vohra</p>
                    <p className="text-[11px]" style={{ color: "rgba(252,250,242,0.5)" }}>Startup Advisor</p>
                  </div>
                </div>
              </div>
              <ArrowUpRight size={24} style={{ color: C.cream }} className="opacity-40 flex-shrink-0" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="gsap-stagger-child rounded-3xl p-8 flex items-start justify-between"
              style={{ backgroundColor: C.teal }}
            >
              <div>
                <h3 className="text-[28px] md:text-[36px] font-bold italic" style={{ fontFamily: C.serif, color: C.cream }}>
                  50+ hours saved
                </h3>
                <p className="text-[14px] mt-2" style={{ color: "rgba(252,250,242,0.6)" }}>
                  Before WriteWell, writing was a battle. Now, it's a conversation.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-[11px] font-bold">G</div>
                  <div>
                    <p className="text-[13px] font-medium" style={{ color: C.cream }}>Greg Dickson</p>
                    <p className="text-[11px]" style={{ color: "rgba(252,250,242,0.5)" }}>Author</p>
                  </div>
                </div>
              </div>
              <ArrowUpRight size={24} style={{ color: C.cream }} className="opacity-40 flex-shrink-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-32 md:py-40 px-6" style={{ backgroundColor: C.cream }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4 gsap-reveal">
            <h2 className="text-[42px] md:text-[64px] font-bold tracking-tight" style={{ fontFamily: C.serif }}>
              Simple pricing
            </h2>
            <p className="text-[17px] max-w-xl mx-auto" style={{ color: C.muted }}>
              Choose the level of writing intelligence that fits your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 gsap-stagger-parent">
            {[
              { name: "Starter", price: "0", features: ["10 Rewrites / month", "Clarity & Concision modes", "Basic Analysis", "Standard Support"] },
              { name: "Pro", price: "29", popular: true, features: ["Unlimited Rewrites", "All 6 Strategic Modes", "Full AI Audit Suite", "Platform Resonance Mapping", "Priority Support"] },
              { name: "Enterprise", price: "Custom", features: ["Custom Brand Voice", "Team Collaboration", "API Access", "Dedicated Success Manager", "SSO & Security"] },
            ].map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className={`gsap-stagger-child rounded-3xl p-10 space-y-8 flex flex-col relative border transition-all ${
                  p.popular
                    ? "border-[#d8b4fe]/50 bg-white shadow-2xl shadow-purple-200/20 glow-lavender"
                    : "border-black/[0.06] bg-white"
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-[#d8b4fe] text-black text-[11px] font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>{p.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[48px] font-bold" style={{ fontFamily: C.serif }}>{p.price === "Custom" ? "" : "$"}{p.price}</span>
                    {p.price !== "Custom" && <span className="text-[15px]" style={{ color: C.muted }}>/mo</span>}
                  </div>
                </div>
                <ul className="space-y-4 flex-1">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-[14px]" style={{ color: "rgba(0,0,0,0.7)" }}>
                      <Check size={16} className="text-[#0f3d2e] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLaunchApp}
                  className={`w-full py-4 rounded-full font-semibold text-[15px] transition-all ${
                    p.popular
                      ? "bg-[#d8b4fe] text-black shadow-lg shadow-purple-300/20"
                      : "bg-[#1a1a1a] text-white"
                  }`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: C.dark }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f3d2e]/40 via-transparent to-[#0a0a0a]" />
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`cta-p-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 2 + (i % 3) * 2,
              height: 2 + (i % 3) * 2,
              left: `${8 + i * 7.5}%`,
              bottom: '0%',
              backgroundColor: i % 2 === 0 ? '#d8b4fe' : '#0f3d2e',
            }}
            animate={{
              y: [0, -500 - i * 30],
              x: [0, (i % 2 ? 30 : -30)],
              opacity: [0, 0.5, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut",
            }}
          />
        ))}
        <div className="relative z-10 py-32 md:py-48 px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[48px] md:text-[72px] lg:text-[96px] font-bold italic tracking-tight"
            style={{ fontFamily: C.serif, color: C.cream }}
          >
            Start writing well
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ....
            </motion.span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-[17px] max-w-xl mx-auto mt-8 leading-relaxed"
            style={{ color: "rgba(252,250,242,0.6)" }}
          >
            Effortless writing intelligence in every context: 10x more impactful than generic AI, strategic modes, and deep analysis.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLaunchApp}
              className="pill-btn pill-btn-outline-cream text-[15px] px-7 py-3.5"
            >
              <Mic size={16} />
              Try WriteWell
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLaunchApp}
              className="pill-btn pill-btn-lavender text-[15px] px-7 py-3.5 font-semibold"
            >
              Launch App
            </motion.button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="text-[13px] mt-6"
            style={{ color: "rgba(252,250,242,0.35)" }}
          >
            Free to start. No credit card required.
          </motion.p>
          <svg className="absolute top-[15%] right-[10%] w-[200px] h-[300px] opacity-15 pointer-events-none" viewBox="0 0 200 300">
            <motion.path
              d="M 10 10 Q 190 50 180 150 Q 170 250 50 290"
              fill="none"
              stroke="#fcfaf2"
              strokeWidth="3"
              strokeDasharray="6 8"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </svg>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-20 px-6" style={{ backgroundColor: C.cream }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16">
            <div>
              <h4 className="text-[16px] mb-5" style={{ fontFamily: C.serif, color: C.muted }}>Company</h4>
              <ul className="space-y-3">
                {["About", "Careers", "Trust Center", "Media Kit"].map(link => (
                  <li key={link}><a href="#" className="text-[14px] font-medium hover:underline" style={{ color: C.teal }}>{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[16px] mb-5" style={{ fontFamily: C.serif, color: C.muted }}>Product</h4>
              <ul className="space-y-3">
                {["Features", "Pricing", "Modes", "AI Audit", "API"].map(link => (
                  <li key={link}><a href="#" className="text-[14px] font-medium hover:underline" style={{ color: C.teal }}>{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[16px] mb-5" style={{ fontFamily: C.serif, color: C.muted }}>Resources</h4>
              <ul className="space-y-3">
                {["Help Center", "Blog", "Contact Sales", "Privacy", "Terms"].map(link => (
                  <li key={link}><a href="#" className="text-[14px] font-medium hover:underline" style={{ color: C.teal }}>{link}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="py-12 border-t border-black/5 gsap-elastic">
            <div className="flex items-center gap-4">
              <Logo size={60} />
              <span className="text-[64px] md:text-[96px] lg:text-[120px] font-bold tracking-tight leading-none gradient-text-shimmer" style={{ fontFamily: C.serif }}>
                WriteWell
              </span>
            </div>
          </div>
          <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[13px]" style={{ color: C.muted }}>
              © WriteWell by Schroeder Technologies 2026
            </span>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[13px] hover:underline" style={{ color: C.muted }}>Terms</a>
              <a href="#" className="text-[13px] hover:underline" style={{ color: C.muted }}>Privacy</a>
              <div className="flex items-center gap-3">
                {[Twitter, Linkedin, Globe].map((Icon, i) => (
                  <a key={i} href="#" className="p-2 rounded-full hover:bg-black/5 transition-colors opacity-40 hover:opacity-100">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
