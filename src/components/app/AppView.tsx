/** @license SPDX-License-Identifier: Apache-2.0 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import {
  Sparkles,
  Search,
  History as HistoryIcon,
  Copy,
  RotateCcw,
  Check,
  ChevronRight,
  AlertCircle,
  Zap,
  User,
  Target,
  Globe,
  Trash2,
  Moon,
  Sun,
  Download,
  XCircle,
  FileText,
  ShieldCheck,
  Activity,
  Layers,
  Menu,
  X,
  Home,
  LogOut,
  PenLine,
} from "lucide-react";

import { C, MODE_COLORS, MODES, INTENTS, AUDIENCES, PLATFORMS } from "../../constants";
import { Logo } from "../common/Logo";
import { Score } from "../common/Score";
import { rewriteText, analyseText } from "../../services/gemini";
import { exportPDF, exportTXT } from "../../utils/export";
import { scoreColor } from "../../utils/scoring";
import { useTheme } from "../../hooks/useTheme";
import { useHistory } from "../../hooks/useHistory";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { AnalysisResult, AnalysisIssue } from "../../types";

const EASE = [0.16, 1, 0.3, 1] as const;
const TABS = ["write", "output", "analysis", "issues"] as const;

export const AppView = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("CLARITY");
  const [intent, setIntent] = useState("Persuade");
  const [audience, setAudience] = useState("LinkedIn Connections");
  const [platform, setPlatform] = useState("LinkedIn Post");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("write");
  const [copyState, setCopyState] = useState("Copy");
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [customVoice, setCustomVoice] = useState("");
  const [showCompare, setShowCompare] = useState(false);
  const [originalInput, setOriginalInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isDark, setIsDark, theme } = useTheme();
  const { history, setHistory, addToHistory } = useHistory();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const rewrite = useCallback(async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput("");
    setError(null);
    setActiveTab("output");

    try {
      setOriginalInput(input);
      const text = await rewriteText({ input, mode, intent, audience, platform, customVoice });
      setOutput(text);

      const item = {
        id: Date.now(),
        input: input.slice(0, 150),
        input_full: input,
        output: text,
        mode,
        platform,
        date: new Date().toLocaleTimeString(),
      };
      addToHistory(item, history);
    } catch (e: any) {
      console.error(e);
      let msg = "Failed to generate rewrite.";
      if (e.message?.includes("API key")) msg = "Invalid API Key. Please check your configuration.";
      else if (e.message?.includes("safety")) msg = "Content flagged by safety filters. Please try different text.";
      else if (e.message?.includes("quota")) msg = "API quota exceeded. Please try again later.";
      setError(msg);
      setOutput("");
    }
    setLoading(false);
  }, [input, mode, intent, audience, platform, loading, history, customVoice, addToHistory]);

  const analyse = useCallback(async (isModal = false) => {
    if (!input.trim() || analysing) return;
    setAnalysing(true);
    setError(null);
    if (isModal) {
      setShowAnalysisModal(true);
    } else {
      setActiveTab("analysis");
    }

    try {
      const result = await analyseText(input);
      setAnalysis(result);
    } catch (e: any) {
      console.error(e);
      let msg = "Analysis failed.";
      if (e.message?.includes("JSON")) msg = "Model returned invalid analysis data. Please try again.";
      setError(msg);
      if (isModal) setShowAnalysisModal(false);
    }
    setAnalysing(false);
  }, [input, analysing]);

  const copyOutput = async () => {
    if (!output) return;
    try { await navigator.clipboard.writeText(output); } catch { /* noop */ }
    setCopyState("Copied!");
    setTimeout(() => setCopyState("Copy"), 2000);
  };

  const useOutput = () => {
    if (output) {
      setInput(output);
      setOutput("");
      setActiveTab("write");
    }
  };

  useKeyboardShortcuts({
    onRewrite: rewrite,
    onToggleHistory: () => setShowHistory(prev => !prev),
    onCopy: copyOutput,
  });

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: theme.bg, color: theme.text }}>

      {/* ── TOPBAR ── */}
      <header
        className="h-14 flex items-center justify-between px-4 md:px-6 border-b shrink-0 z-40"
        style={{ background: theme.bg, borderColor: theme.border }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-black/5 transition-colors"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex items-center gap-2.5">
            <Logo size={28} />
            <div className="flex flex-col">
              <span style={{ fontFamily: C.serif }} className="text-lg font-bold leading-tight tracking-tight">WriteWell</span>
              <span className="font-mono text-[7px] tracking-[0.15em] uppercase leading-none" style={{ color: theme.dim }}>
                by Schroeder Technologies
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="hidden sm:flex items-center gap-0.5 rounded-full border px-1.5 py-0.5" style={{ borderColor: theme.border }}>
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className="p-1 rounded-full hover:bg-black/5 transition-colors text-[11px] font-mono"
              style={{ color: theme.dim }}
            >
              A-
            </button>
            <span className="font-mono text-[10px] w-5 text-center" style={{ color: theme.muted }}>{fontSize}</span>
            <button
              onClick={() => setFontSize(Math.min(32, fontSize + 2))}
              className="p-1 rounded-full hover:bg-black/5 transition-colors text-[11px] font-mono font-bold"
              style={{ color: theme.dim }}
            >
              A+
            </button>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl hover:bg-black/5 transition-colors"
            title="Toggle theme"
            style={{ color: theme.muted }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-xl hover:bg-black/5 transition-colors"
            title="History (Ctrl+H)"
            style={{ color: theme.muted }}
          >
            <HistoryIcon size={18} />
          </button>

          {user && (
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="p-2 rounded-xl hover:bg-black/5 transition-colors"
              title="Logout"
              style={{ color: theme.muted }}
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* ── SIDEBAR ── */}
        <aside
          className={`
            w-[260px] shrink-0 border-r flex flex-col overflow-y-auto z-40
            fixed lg:relative top-14 lg:top-0 bottom-0 left-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            transition-transform duration-300 ease-out
          `}
          style={{ background: theme.bg, borderColor: theme.border }}
        >
          {/* Mode Selection */}
          <div className="p-4 space-y-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] block mb-3 px-1" style={{ color: theme.dim }}>
              Rewrite Mode
            </span>
            {MODES.map(m => {
              const active = mode === m;
              const color = MODE_COLORS[m];
              return (
                <button
                  key={m}
                  onClick={() => { setMode(m); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative"
                  style={{
                    background: active ? `${color}15` : "transparent",
                    color: active ? color : theme.text,
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="mode-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
                      style={{ background: color }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200"
                    style={{
                      background: color,
                      transform: active ? "scale(1.2)" : "scale(1)",
                      boxShadow: active ? `0 0 8px ${color}50` : "none",
                    }}
                  />
                  <span className={`font-mono text-[11px] uppercase tracking-wider ${active ? "font-bold" : "font-medium opacity-50 group-hover:opacity-80"}`}>
                    {m}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mx-4 h-px" style={{ background: theme.border }} />

          {/* Context Controls */}
          <div className="p-4 space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] block px-1" style={{ color: theme.dim }}>
              Context
            </span>
            {[
              { icon: Target, label: "Intent", value: intent, setter: setIntent, options: INTENTS },
              { icon: User, label: "Audience", value: audience, setter: setAudience, options: AUDIENCES },
              { icon: Globe, label: "Platform", value: platform, setter: setPlatform, options: PLATFORMS },
            ].map(({ icon: Icon, label, value, setter, options }) => (
              <div key={label} className="space-y-1.5">
                <label className="flex items-center gap-1.5 px-1">
                  <Icon size={12} style={{ color: theme.dim }} />
                  <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: theme.dim }}>{label}</span>
                </label>
                <select
                  value={value}
                  onChange={e => setter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-[13px] font-medium outline-none transition-all border cursor-pointer appearance-none"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                >
                  {options.map(o => <option key={o} value={o} style={{ background: theme.bg }}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="mx-4 h-px" style={{ background: theme.border }} />

          {/* Custom Voice */}
          <div className="p-4 space-y-1.5">
            <label className="flex items-center gap-1.5 px-1">
              <PenLine size={12} style={{ color: theme.dim }} />
              <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: theme.dim }}>Brand Voice</span>
            </label>
            <input
              type="text"
              value={customVoice}
              onChange={e => setCustomVoice(e.target.value)}
              placeholder="e.g. Witty yet empathetic"
              className="w-full px-3 py-2 rounded-xl text-[13px] outline-none transition-all border"
              style={{
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                borderColor: theme.border,
                color: theme.text,
              }}
            />
          </div>

          <div className="flex-1" />

          <div className="p-4 border-t" style={{ borderColor: theme.border }}>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 transition-colors w-full"
            >
              <Home size={14} style={{ color: theme.dim }} />
              <span className="text-[12px] font-medium" style={{ color: theme.muted }}>Back to Home</span>
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Tabs */}
          <div className="h-12 flex items-center gap-1 px-4 md:px-6 border-b shrink-0" style={{ borderColor: theme.border }}>
            <div className="flex items-center gap-1 p-0.5 rounded-full border" style={{ borderColor: theme.border, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
              {TABS.map(tab => {
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative px-4 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all duration-200"
                    style={{ color: active ? theme.text : theme.dim }}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-tab"
                        className="absolute inset-0 rounded-full"
                        style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 ${active ? "font-bold" : "font-medium"}`}>
                      {tab}
                      {tab === "issues" && analysis?.issues && analysis.issues.length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[7px] font-bold">
                          {analysis.issues.length}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: `${MODE_COLORS[mode]}12` }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: MODE_COLORS[mode] }} />
                <span className="font-mono text-[9px] uppercase tracking-wider font-bold" style={{ color: MODE_COLORS[mode] }}>{mode}</span>
              </div>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mx-4 md:mx-6 mt-3"
              >
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500">
                  <XCircle size={16} />
                  <span className="text-[13px] font-medium flex-1">{error}</span>
                  <button onClick={() => setError(null)} className="opacity-60 hover:opacity-100 shrink-0"><X size={14} /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">

              {/* WRITE */}
              {activeTab === "write" && (
                <motion.div key="write" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="h-full flex flex-col">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Paste your writing here — an email, a LinkedIn post, a proposal, an article — any text you want made more powerful."
                    className="flex-1 w-full p-6 md:p-10 font-light leading-relaxed resize-none focus:outline-none placeholder:opacity-20"
                    style={{ fontSize: `${fontSize}px`, background: "transparent", color: theme.text }}
                  />
                  <div className="px-4 md:px-6 py-3 border-t flex items-center justify-between gap-4 shrink-0" style={{ borderColor: theme.border }}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px]" style={{ color: theme.dim }}>
                        {input.split(/\s+/).filter(Boolean).length} words · {input.length} chars
                      </span>
                      {input && (
                        <button onClick={() => setInput("")} className="p-1 rounded-lg hover:bg-red-500/10 transition-colors" title="Clear">
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => analyse(true)}
                        disabled={!input.trim() || analysing}
                        className="px-4 py-2 rounded-full border font-mono text-[10px] uppercase tracking-wider font-semibold disabled:opacity-30 transition-all flex items-center gap-1.5"
                        style={{ borderColor: theme.border, color: theme.text }}
                      >
                        <Activity size={13} className={analysing ? "animate-spin" : ""} />
                        Quick Scan
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={rewrite}
                        disabled={!input.trim() || loading}
                        className="px-6 py-2 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold disabled:opacity-30 transition-all flex items-center gap-1.5 text-white shadow-lg"
                        style={{ background: input.trim() ? MODE_COLORS[mode] : theme.border, boxShadow: input.trim() ? `0 4px 20px ${MODE_COLORS[mode]}30` : "none" }}
                      >
                        {loading ? <Sparkles size={13} className="animate-spin" /> : <Zap size={13} />}
                        {loading ? "Rewriting..." : "Rewrite"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* OUTPUT */}
              {activeTab === "output" && (
                <motion.div key="output" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, ease: EASE }} className="p-6 md:p-10">
                  {loading ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3" style={{ color: MODE_COLORS[mode] }}>
                        <Sparkles className="animate-spin" size={18} />
                        <span className="font-mono text-[11px] uppercase tracking-wider font-bold">Transforming your text...</span>
                      </div>
                      <div className="space-y-4">
                        {[100, 90, 95, 80, 60].map((w, i) => (
                          <div key={i} className="h-4 rounded-full animate-pulse" style={{ width: `${w}%`, background: theme.border }} />
                        ))}
                      </div>
                    </div>
                  ) : output ? (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b" style={{ borderColor: theme.border }}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: MODE_COLORS[mode] }} />
                          <span className="font-mono text-[11px] uppercase tracking-wider font-bold" style={{ color: MODE_COLORS[mode] }}>{mode} Transformation</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <button onClick={() => setShowCompare(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-wider font-semibold hover:bg-black/5 transition-all" style={{ borderColor: theme.border }}>
                            <Layers size={12} /> Compare
                          </button>
                          <button onClick={() => exportTXT(output)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-wider font-semibold hover:bg-black/5 transition-all" style={{ borderColor: theme.border }}>
                            <FileText size={12} /> TXT
                          </button>
                          <button onClick={() => exportPDF(output, mode, platform, intent)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-mono uppercase tracking-wider font-semibold hover:bg-black/5 transition-all" style={{ borderColor: theme.border }}>
                            <Download size={12} /> PDF
                          </button>
                          <button onClick={copyOutput} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold transition-all text-white" style={{ background: theme.text }}>
                            {copyState === "Copy" ? <Copy size={12} /> : <Check size={12} />}
                            {copyState}
                          </button>
                        </div>
                      </div>
                      <div className="font-light leading-relaxed markdown-body" style={{ fontSize: `${fontSize}px` }}>
                        <Markdown>{output}</Markdown>
                      </div>
                      <div className="pt-5 flex items-center justify-between border-t" style={{ borderColor: theme.border }}>
                        <button onClick={useOutput} className="flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-mono uppercase tracking-wider font-semibold hover:bg-black/5 transition-all" style={{ borderColor: theme.border }}>
                          <RotateCcw size={13} /> Use as Input
                        </button>
                        <span className="font-mono text-[10px]" style={{ color: theme.dim }}>{output.length} chars</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center" style={{ color: theme.dim }}>
                      <Logo size={64} className="mb-5 opacity-30" />
                      <h3 style={{ fontFamily: C.serif }} className="text-2xl font-bold mb-2 opacity-40">Awaiting Input</h3>
                      <p className="text-[13px] max-w-xs opacity-30">Write or paste your text in the Write tab, then hit Rewrite.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ANALYSIS */}
              {activeTab === "analysis" && (
                <motion.div key="analysis" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, ease: EASE }} className="p-6 md:p-10">
                  {analysing ? (
                    <div className="space-y-8">
                      <div className="flex items-center gap-3 text-amber-500">
                        <Search className="animate-spin" size={18} />
                        <span className="font-mono text-[11px] uppercase tracking-wider font-bold">Deep scanning...</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: theme.border }} />)}
                      </div>
                    </div>
                  ) : analysis ? (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-1">
                          <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: theme.dim }}>Performance Metrics</h4>
                          <Score label="Readability" value={analysis.readability} color={scoreColor(analysis.readability)} />
                          <Score label="Clarity" value={analysis.clarity} color={scoreColor(analysis.clarity)} />
                          <Score label="Authority" value={analysis.authority} color={scoreColor(analysis.authority)} />
                          <Score label="Engagement" value={analysis.engagement} color={scoreColor(analysis.engagement)} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { l: "Intent", v: analysis.detected_intent },
                            { l: "Tone", v: analysis.detected_tone },
                            { l: "Words", v: analysis.word_count },
                            { l: "Sentences", v: analysis.sentence_count },
                            { l: "Avg Length", v: `${analysis.avg_sentence_length?.toFixed(1)} w` },
                            { l: "Passive Voice", v: analysis.passive_voice_count },
                          ].map(s => (
                            <div key={s.l} className="p-4 rounded-2xl border" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderColor: theme.border }}>
                              <span className="block font-mono text-[8px] uppercase tracking-[0.15em] mb-1" style={{ color: theme.dim }}>{s.l}</span>
                              <span className="text-sm font-bold">{s.v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {analysis.banned_words?.length > 0 && (
                        <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                          <div className="flex items-center gap-2 text-amber-600 mb-3">
                            <AlertCircle size={14} />
                            <span className="font-mono text-[9px] uppercase tracking-wider font-bold">Buzzword Alert</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {analysis.banned_words.map(w => <span key={w} className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-700 text-[10px] font-mono font-bold">{w}</span>)}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysis.summary && (
                          <div className="p-5 rounded-2xl border" style={{ background: isDark ? "rgba(45,206,137,0.05)" : "#f0fdf4", borderColor: isDark ? "rgba(45,206,137,0.2)" : "#dcfce7" }}>
                            <div className="flex items-center gap-2 text-green-600 mb-2">
                              <Check size={14} />
                              <span className="font-mono text-[9px] uppercase tracking-wider font-bold">Strength</span>
                            </div>
                            <p className="text-[13px] leading-relaxed" style={{ color: isDark ? "#88ebbc" : "#166534" }}>{analysis.summary}</p>
                          </div>
                        )}
                        {analysis.weakness && (
                          <div className="p-5 rounded-2xl border" style={{ background: isDark ? "rgba(245,54,92,0.05)" : "#fef2f2", borderColor: isDark ? "rgba(245,54,92,0.2)" : "#fee2e2" }}>
                            <div className="flex items-center gap-2 text-red-500 mb-2">
                              <AlertCircle size={14} />
                              <span className="font-mono text-[9px] uppercase tracking-wider font-bold">Weakness</span>
                            </div>
                            <p className="text-[13px] leading-relaxed" style={{ color: isDark ? "#fca5a5" : "#991b1b" }}>{analysis.weakness}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center" style={{ color: theme.dim }}>
                      <Search size={48} strokeWidth={1} className="opacity-20 mb-4" />
                      <h3 style={{ fontFamily: C.serif }} className="text-xl font-bold mb-2 opacity-40">No Analysis Yet</h3>
                      <p className="text-[13px] max-w-xs opacity-30">Click "Quick Scan" to analyze your writing.</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => analyse(false)}
                        disabled={!input.trim() || analysing}
                        className="mt-6 px-5 py-2 rounded-full border font-mono text-[10px] uppercase tracking-wider font-semibold disabled:opacity-30 transition-all flex items-center gap-1.5"
                        style={{ borderColor: theme.border }}
                      >
                        <ShieldCheck size={13} /> Run AI Audit
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ISSUES */}
              {activeTab === "issues" && (
                <motion.div key="issues" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, ease: EASE }} className="p-6 md:p-10">
                  {analysis?.issues && analysis.issues.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {analysis.issues.map((issue: AnalysisIssue, i: number) => (
                        <motion.div
                          key={i}
                          whileHover={{ y: -2 }}
                          className="p-5 rounded-2xl border transition-all hover:shadow-lg"
                          style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#fff", borderColor: theme.border }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                issue.type === "Grammar" ? "bg-red-500/10 text-red-500" :
                                issue.type === "Clarity" ? "bg-amber-500/10 text-amber-500" :
                                issue.type === "Tone" ? "bg-purple-500/10 text-purple-500" :
                                "bg-blue-500/10 text-blue-500"
                              }`}>
                                {issue.type === "Grammar" ? <AlertCircle size={14} /> :
                                 issue.type === "Clarity" ? <Zap size={14} /> :
                                 issue.type === "Tone" ? <User size={14} /> :
                                 <ShieldCheck size={14} />}
                              </div>
                              <span className="font-mono text-[9px] uppercase tracking-wider font-bold" style={{ color: theme.dim }}>{issue.type}</span>
                            </div>
                            <span className="text-[10px] italic max-w-[120px] truncate" style={{ color: theme.dim }}>&quot;{issue.text}&quot;</span>
                          </div>
                          <p className="text-[13px] font-medium leading-relaxed mb-4">{issue.suggestion}</p>
                          <button
                            onClick={() => navigator.clipboard.writeText(issue.suggestion)}
                            className="w-full py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-1.5 border"
                            style={{ borderColor: theme.border, color: theme.muted }}
                          >
                            <Copy size={11} /> Copy Fix
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center" style={{ color: theme.dim }}>
                      <Zap size={48} strokeWidth={1} className="opacity-20 mb-4" />
                      <h3 style={{ fontFamily: C.serif }} className="text-xl font-bold mb-2 opacity-40">All Clear</h3>
                      <p className="text-[13px] max-w-xs opacity-30">No issues detected. Run an analysis to check for improvements.</p>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* ── COMPARE MODAL ── */}
      <AnimatePresence>
        {showCompare && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCompare(false)} className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="fixed inset-4 md:inset-8 z-[110] rounded-3xl overflow-hidden flex flex-col border shadow-2xl"
              style={{ background: theme.bg, borderColor: theme.border }}
            >
              <div className="p-5 border-b flex items-center justify-between shrink-0" style={{ borderColor: theme.border }}>
                <div className="flex items-center gap-2.5">
                  <Layers size={18} style={{ color: MODE_COLORS[mode] }} />
                  <h2 className="font-bold text-lg">Compare</h2>
                </div>
                <button onClick={() => setShowCompare(false)} className="p-2 rounded-xl hover:bg-black/5 transition-colors">
                  <X size={20} style={{ color: theme.muted }} />
                </button>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-x overflow-y-auto" style={{ borderColor: theme.border }}>
                <div className="p-6 md:p-10 space-y-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: theme.dim }}>Original</span>
                  <div className="font-light leading-relaxed opacity-60 whitespace-pre-wrap" style={{ fontSize: `${fontSize}px` }}>{originalInput || input}</div>
                </div>
                <div className="p-6 md:p-10 space-y-4" style={{ background: `${MODE_COLORS[mode]}08` }}>
                  <div className="flex items-center gap-2" style={{ color: MODE_COLORS[mode] }}>
                    <Sparkles size={12} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold">Transformed</span>
                  </div>
                  <div className="font-medium leading-relaxed markdown-body" style={{ fontSize: `${fontSize}px` }}>
                    <Markdown>{output}</Markdown>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── QUICK SCAN MODAL ── */}
      <AnimatePresence>
        {showAnalysisModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAnalysisModal(false)} className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-[110] rounded-3xl overflow-hidden flex flex-col border shadow-2xl"
              style={{ background: theme.bg, borderColor: theme.border }}
            >
              <div className="p-6 border-b flex items-center justify-between shrink-0" style={{ borderColor: theme.border }}>
                <div className="flex items-center gap-2.5">
                  <Activity className="text-blue-500" size={18} />
                  <h2 className="font-bold text-lg">Quick Scan</h2>
                </div>
                <button onClick={() => setShowAnalysisModal(false)} className="p-2 rounded-xl hover:bg-black/5 transition-colors">
                  <X size={20} style={{ color: theme.muted }} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {analysing ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <Activity className="animate-spin text-blue-500" size={40} />
                    <p className="font-mono text-[11px] uppercase tracking-wider" style={{ color: theme.dim }}>Scanning...</p>
                  </div>
                ) : analysis ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: theme.dim }}>Metrics</h4>
                        <Score label="Readability" value={analysis.readability} color={scoreColor(analysis.readability)} />
                        <Score label="Clarity" value={analysis.clarity} color={scoreColor(analysis.clarity)} />
                        <Score label="Authority" value={analysis.authority} color={scoreColor(analysis.authority)} />
                        <Score label="Engagement" value={analysis.engagement} color={scoreColor(analysis.engagement)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { l: "Intent", v: analysis.detected_intent },
                          { l: "Tone", v: analysis.detected_tone },
                          { l: "Words", v: analysis.word_count },
                          { l: "Sentences", v: analysis.sentence_count },
                          { l: "Avg Length", v: `${analysis.avg_sentence_length?.toFixed(1)} w` },
                          { l: "Passive", v: analysis.passive_voice_count },
                        ].map(s => (
                          <div key={s.l} className="p-3 rounded-xl border" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderColor: theme.border }}>
                            <span className="block font-mono text-[8px] uppercase tracking-[0.15em] mb-1" style={{ color: theme.dim }}>{s.l}</span>
                            <span className="text-sm font-bold">{s.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {analysis.banned_words?.length > 0 && (
                      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                        <div className="flex items-center gap-2 text-amber-600 mb-2">
                          <AlertCircle size={14} />
                          <span className="font-mono text-[9px] uppercase tracking-wider font-bold">Buzzwords</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.banned_words.map(w => <span key={w} className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 text-[10px] font-mono font-bold">{w}</span>)}
                        </div>
                      </div>
                    )}
                    {analysis.summary && (
                      <div className="p-4 rounded-xl border" style={{ background: isDark ? "rgba(45,206,137,0.05)" : "#f0fdf4", borderColor: isDark ? "rgba(45,206,137,0.2)" : "#dcfce7" }}>
                        <div className="flex items-center gap-2 text-green-600 mb-1.5">
                          <Check size={14} />
                          <span className="font-mono text-[9px] uppercase tracking-wider font-bold">Strength</span>
                        </div>
                        <p className="text-[13px] leading-relaxed" style={{ color: isDark ? "#88ebbc" : "#166534" }}>{analysis.summary}</p>
                      </div>
                    )}
                    {analysis.weakness && (
                      <div className="p-4 rounded-xl border" style={{ background: isDark ? "rgba(245,54,92,0.05)" : "#fef2f2", borderColor: isDark ? "rgba(245,54,92,0.2)" : "#fee2e2" }}>
                        <div className="flex items-center gap-2 text-red-500 mb-1.5">
                          <AlertCircle size={14} />
                          <span className="font-mono text-[9px] uppercase tracking-wider font-bold">Weakness</span>
                        </div>
                        <p className="text-[13px] leading-relaxed" style={{ color: isDark ? "#fca5a5" : "#991b1b" }}>{analysis.weakness}</p>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
              <div className="p-4 border-t shrink-0" style={{ borderColor: theme.border }}>
                <button onClick={() => setShowAnalysisModal(false)} className="w-full py-2.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold transition-all" style={{ background: theme.text, color: theme.bg }}>
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── HISTORY DRAWER ── */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHistory(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm shadow-2xl z-[70] flex flex-col border-l"
              style={{ background: theme.bg, borderColor: theme.border }}
            >
              <div className="p-5 border-b flex items-center justify-between shrink-0" style={{ borderColor: theme.border }}>
                <h2 className="font-bold text-lg">History</h2>
                <button onClick={() => setShowHistory(false)} className="p-2 rounded-xl hover:bg-black/5 transition-colors">
                  <ChevronRight size={18} style={{ color: theme.muted }} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {history.map(h => (
                  <button
                    key={h.id}
                    onClick={() => {
                      setInput(h.input_full || h.input);
                      setOutput(h.output);
                      setMode(h.mode);
                      setShowHistory(false);
                      setActiveTab("output");
                    }}
                    className="w-full text-left p-4 rounded-2xl border hover:bg-black/[0.02] transition-all relative overflow-hidden"
                    style={{ borderColor: theme.border }}
                  >
                    <div className="absolute top-0 left-0 w-[3px] h-full rounded-r-full" style={{ background: MODE_COLORS[h.mode] }} />
                    <div className="flex justify-between items-center mb-2 pl-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full" style={{ color: MODE_COLORS[h.mode], background: `${MODE_COLORS[h.mode]}12` }}>{h.mode}</span>
                        <span className="font-mono text-[8px] uppercase tracking-wider" style={{ color: theme.dim }}>{h.platform || "General"}</span>
                      </div>
                      <span className="text-[9px]" style={{ color: theme.dim }}>{h.date}</span>
                    </div>
                    <p className="text-[12px] font-medium line-clamp-1 mb-0.5 pl-2" style={{ opacity: 0.8 }}>{h.input.slice(0, 60)}...</p>
                    <p className="text-[11px] line-clamp-2 leading-relaxed italic pl-2" style={{ color: theme.dim }}>&quot;{h.output.slice(0, 80)}...&quot;</p>
                  </button>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-20" style={{ color: theme.dim }}>
                    <HistoryIcon size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="text-[13px] opacity-40">No history yet</p>
                  </div>
                )}
              </div>
              {history.length > 0 && (
                <div className="p-3 border-t shrink-0" style={{ borderColor: theme.border }}>
                  <button
                    onClick={() => setHistory([])}
                    className="w-full py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={12} /> Clear All
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
