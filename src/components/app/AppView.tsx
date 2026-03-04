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
  Type as TypeIcon,
  Download,
  XCircle,
  FileText,
  ShieldCheck,
  Activity,
  Layers,
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
import type { AnalysisResult, AnalysisIssue } from "../../types";

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
  const [activePanel, setActivePanel] = useState("rewrite");
  const [copyState, setCopyState] = useState("Copy");
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [customVoice, setCustomVoice] = useState("");
  const [showCompare, setShowCompare] = useState(false);
  const [originalInput, setOriginalInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isDark, setIsDark, theme } = useTheme();
  const { history, setHistory, addToHistory } = useHistory();

  const rewrite = useCallback(async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput("");
    setError(null);
    setActivePanel("rewrite");

    try {
      setOriginalInput(input);
      const text = await rewriteText({ input, mode, intent, audience, platform, customVoice });
      setOutput(text);

      // Save to history
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
      setActivePanel("analysis");
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
    setCopyState("Copied \u2713");
    setTimeout(() => setCopyState("Copy"), 2000);
  };

  const useOutput = () => {
    if (output) {
      setInput(output);
      setOutput("");
    }
  };

  useKeyboardShortcuts({
    onRewrite: rewrite,
    onToggleHistory: () => setShowHistory(prev => !prev),
    onCopy: copyOutput,
  });

  return (
    <>
      {/* Fluid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20"
          style={{ background: `radial-gradient(circle, ${MODE_COLORS[mode]} 0%, transparent 70%)` }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0], x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20"
          style={{ background: `radial-gradient(circle, ${isDark ? '#5e72e4' : '#fb6340'} 0%, transparent 70%)` }}
        />
      </div>

      {/* Dynamic Styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        .glass {
          background: ${isDark ? 'rgba(20, 20, 20, 0.4)' : 'rgba(255, 255, 255, 0.4)'};
          backdrop-filter: blur(32px) saturate(200%);
          -webkit-backdrop-filter: blur(32px) saturate(200%);
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
        }
        .glass-card {
          background: ${isDark ? 'rgba(40, 40, 40, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
          backdrop-filter: blur(16px);
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
          box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.02);
        }
        .glass-input {
          background: ${isDark ? 'rgba(30, 30, 30, 0.3)' : 'rgba(255, 255, 255, 0.3)'};
          backdrop-filter: blur(8px);
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          border-radius: 12px;
          padding: 6px 12px;
          appearance: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .glass-input:hover {
          background: ${isDark ? 'rgba(50, 50, 50, 0.4)' : 'rgba(255, 255, 255, 0.5)'};
        }
        .glass-input:focus {
          outline: none;
          border-color: ${MODE_COLORS[mode]};
          box-shadow: 0 0 0 2px ${MODE_COLORS[mode]}22;
        }
      `}</style>

      {/* TOPBAR */}
      <header className="h-16 glass flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 transition-all duration-500">
        <div className="max-w-[1800px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex flex-col">
              <span className="font-sans text-xl md:text-2xl font-bold tracking-tight leading-none">WriteWell</span>
              <span className="font-mono text-[8px] tracking-[0.2em] uppercase opacity-40">by Schroeder Technologies</span>
            </div>

            <div className="hidden lg:flex border rounded-full p-1 transition-colors" style={{ background: theme.s1, borderColor: theme.border }}>
              {MODES.map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-1.5 rounded-full font-mono text-[10px] tracking-wider uppercase transition-all duration-200 ${
                    mode === m
                      ? "bg-white text-black shadow-sm ring-1 ring-black/5"
                      : "opacity-40 hover:opacity-60"
                  }`}
                  style={{
                    color: mode === m ? MODE_COLORS[m] : theme.text,
                    background: mode === m ? (isDark ? "#333" : "#fff") : "transparent",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 border rounded-full p-1 transition-colors" style={{ background: theme.s1, borderColor: theme.border }}>
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
                title="Decrease Font Size"
              >
                <TypeIcon size={14} className="scale-75" />
              </button>
              <span className="font-mono text-[10px] w-6 text-center">{fontSize}</span>
              <button
                onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
                title="Increase Font Size"
              >
                <TypeIcon size={14} className="scale-125" />
              </button>
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-full hover:bg-black/5 opacity-60 transition-colors"
              title="History"
            >
              <HistoryIcon size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border transition-colors" style={{ background: theme.s1, borderColor: theme.border }}>
              <div className="w-2 h-2 rounded-full" style={{ background: MODE_COLORS[mode] }} />
              <span className="font-mono text-[10px] tracking-wider uppercase font-medium" style={{ color: MODE_COLORS[mode] }}>
                {mode}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT - left input, right output */}
      <main className="max-w-[1800px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-64px)]">

        {/* LEFT: INPUT */}
        <section className="flex flex-col border-r transition-colors" style={{ borderColor: theme.border }}>
          {/* Context Controls */}
          <div className="p-4 border-b flex flex-wrap gap-4 items-center transition-colors" style={{ background: `${theme.s1}88`, borderColor: theme.border }}>
            <div className="flex items-center gap-2">
              <Target size={14} className="opacity-40" />
              <span className="font-mono text-[10px] uppercase opacity-40 tracking-wider">Intent</span>
              <select
                value={intent}
                onChange={e => setIntent(e.target.value)}
                className="glass-input text-xs font-medium"
                style={{ color: theme.text }}
              >
                {INTENTS.map(i => <option key={i} value={i} style={{ background: theme.bg }}>{i}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <User size={14} className="opacity-40" />
              <span className="font-mono text-[10px] uppercase opacity-40 tracking-wider">Audience</span>
              <select
                value={audience}
                onChange={e => setAudience(e.target.value)}
                className="glass-input text-xs font-medium"
                style={{ color: theme.text }}
              >
                {AUDIENCES.map(a => <option key={a} value={a} style={{ background: theme.bg }}>{a}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={14} className="opacity-40" />
              <span className="font-mono text-[10px] uppercase opacity-40 tracking-wider">Platform</span>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="glass-input text-xs font-medium"
                style={{ color: theme.text }}
              >
                {PLATFORMS.map(p => <option key={p} value={p} style={{ background: theme.bg }}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Paste your writing here. An email, a LinkedIn post, a proposal, an article — any text you want made more powerful."
              className="w-full h-full min-h-[300px] p-8 md:p-12 font-light leading-relaxed resize-none focus:outline-none placeholder:opacity-20 transition-all"
              style={{ fontSize: `${fontSize}px`, background: "transparent", color: theme.text }}
            />
            <AnimatePresence>
              {input.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-8 left-8 right-8 p-4 glass rounded-2xl border border-white/5 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2 opacity-40">
                    <User size={12} />
                    <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Custom Brand Voice (Optional)</span>
                  </div>
                  <input
                    type="text"
                    value={customVoice}
                    onChange={e => setCustomVoice(e.target.value)}
                    placeholder="e.g. 'Witty, slightly cynical, but deeply empathetic'"
                    className="bg-transparent outline-none text-xs font-medium w-full"
                    style={{ color: theme.text }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mx-6 mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500"
              >
                <XCircle size={18} />
                <span className="text-sm font-medium">{error}</span>
                <button onClick={() => setError(null)} className="ml-auto opacity-60 hover:opacity-100">
                  <Trash2 size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer with word count and action buttons */}
          <div className="p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors" style={{ borderColor: theme.border }}>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs opacity-30">
                {input.split(/\s+/).filter(Boolean).length} words &middot; {input.length} chars
              </span>
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="opacity-40 hover:text-red-500 transition-colors"
                  title="Clear"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => analyse(true)}
                disabled={!input.trim() || analysing}
                className="flex-1 sm:flex-none px-6 py-3 rounded-full border font-mono text-[11px] uppercase tracking-widest font-semibold hover:bg-black/5 disabled:opacity-30 transition-all flex items-center justify-center gap-2 glass-card"
                style={{ borderColor: theme.border }}
              >
                <Activity size={14} className={analysing ? "spin" : ""} />
                {analysing ? "Scanning..." : "Quick Scan"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => analyse(false)}
                disabled={!input.trim() || analysing}
                className="flex-1 sm:flex-none px-6 py-3 rounded-full border font-mono text-[11px] uppercase tracking-widest font-semibold hover:bg-black/5 disabled:opacity-30 transition-all flex items-center justify-center gap-2 glass-card"
                style={{ borderColor: theme.border }}
              >
                <ShieldCheck size={14} className={analysing ? "spin text-blue-500" : "text-blue-500"} />
                AI Audit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={rewrite}
                disabled={!input.trim() || loading}
                className="flex-1 sm:flex-none px-8 py-3 rounded-full text-white font-mono text-[11px] uppercase tracking-widest font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-30 transition-all relative overflow-hidden group"
                style={{ background: input.trim() ? MODE_COLORS[mode] : "#ccc" }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                />
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? <Sparkles size={14} className="spin" /> : <Zap size={14} />}
                  {loading ? "Rewriting..." : "Rewrite"}
                </span>
              </motion.button>
            </div>
          </div>
        </section>

        {/* RIGHT: OUTPUT */}
        <section className="flex flex-col transition-colors" style={{ background: `${theme.s1}44` }}>
          {/* Tabs */}
          <div className="h-14 border-b flex items-center justify-between px-6 transition-colors" style={{ background: theme.bg, borderColor: theme.border }}>
            <div className="flex items-center gap-8 h-full">
              {["rewrite", "analysis", "issues"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActivePanel(tab)}
                  className={`h-full font-mono text-[10px] uppercase tracking-widest font-bold transition-all relative ${
                    activePanel === tab ? "opacity-100" : "opacity-30 hover:opacity-50"
                  }`}
                >
                  {tab}
                  {tab === "issues" && analysis?.issues && analysis.issues.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[8px]">
                      {analysis.issues.length}
                    </span>
                  )}
                  {activePanel === tab && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: theme.text }} />
                  )}
                </button>
              ))}
            </div>

            {output && (
              <button
                onClick={() => setShowCompare(!showCompare)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono uppercase tracking-widest font-bold transition-all ${
                  showCompare ? "bg-blue-500 text-white border-blue-500" : "opacity-40 hover:opacity-100"
                }`}
                style={!showCompare ? { borderColor: theme.border } : {}}
              >
                <Layers size={12} />
                {showCompare ? "Exit Compare" : "Compare"}
              </button>
            )}
          </div>

          {/* Content area with AnimatePresence for tab switching */}
          <div className={`flex-1 overflow-y-auto ${showCompare ? 'p-0' : 'p-8 md:p-12'}`}>
            <AnimatePresence mode="wait">
              {/* COMPARE VIEW */}
              {showCompare ? (
                <motion.div
                  key="compare"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full grid grid-cols-1 md:grid-cols-2 divide-x transition-colors"
                  style={{ borderColor: theme.border }}
                >
                  <div className="p-8 md:p-12 space-y-6">
                    <div className="flex items-center gap-2 opacity-30">
                      <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Original Input</span>
                    </div>
                    <div className="font-light leading-relaxed opacity-60 whitespace-pre-wrap" style={{ fontSize: `${fontSize}px`, color: theme.text }}>
                      {originalInput || input}
                    </div>
                  </div>
                  <div className="p-8 md:p-12 space-y-6 bg-blue-500/5">
                    <div className="flex items-center gap-2 text-blue-500">
                      <Sparkles size={12} />
                      <span className="font-mono text-[10px] uppercase tracking-widest font-bold">WriteWell Output</span>
                    </div>
                    <div className="font-medium leading-relaxed markdown-body" style={{ fontSize: `${fontSize}px`, color: theme.text }}>
                      <Markdown>{output}</Markdown>
                    </div>
                  </div>
                </motion.div>
              ) : activePanel === "rewrite" ? (
                /* REWRITE TAB */
                <motion.div
                  key="rewrite"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full flex flex-col"
                >
                  {loading ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 text-blue-500">
                        <Sparkles className="spin" size={20} />
                        <span className="font-mono text-xs uppercase tracking-widest font-bold">Intelligence at work...</span>
                      </div>
                      <div className="space-y-4">
                        <div className="h-4 rounded-full w-full animate-pulse" style={{ background: theme.border }} />
                        <div className="h-4 rounded-full w-[90%] animate-pulse" style={{ background: theme.border }} />
                        <div className="h-4 rounded-full w-[95%] animate-pulse" style={{ background: theme.border }} />
                        <div className="h-4 rounded-full w-[80%] animate-pulse" style={{ background: theme.border }} />
                      </div>
                    </div>
                  ) : output ? (
                    <div className="space-y-8">
                      <div className="flex items-center justify-between pb-6 border-b transition-colors" style={{ borderColor: theme.border }}>
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: MODE_COLORS[mode] }} />
                          <span className="font-mono text-xs uppercase tracking-widest font-bold" style={{ color: MODE_COLORS[mode] }}>
                            {mode} Transformation
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowCompare(!showCompare)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all ${showCompare ? 'bg-blue-500 text-white border-blue-500' : 'hover:bg-black/5 glass-card'}`}
                            style={!showCompare ? { borderColor: theme.border } : {}}
                          >
                            <Layers size={14} />
                            Compare
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => exportTXT(output)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold hover:bg-black/5 transition-all glass-card"
                            style={{ borderColor: theme.border }}
                          >
                            <FileText size={14} />
                            TXT
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => exportPDF(output, mode, platform, intent)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold hover:bg-black/5 transition-all glass-card"
                            style={{ borderColor: theme.border }}
                          >
                            <Download size={14} />
                            PDF
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={copyOutput}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold hover:opacity-80 transition-all shadow-lg"
                            style={{ background: theme.text, color: theme.bg }}
                          >
                            {copyState === "Copy" ? <Copy size={14} /> : <Check size={14} />}
                            {copyState}
                          </motion.button>
                        </div>
                      </div>
                      <div className="font-light leading-relaxed opacity-80 markdown-body" style={{ fontSize: `${fontSize}px` }}>
                        {showCompare ? (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-4">
                              <span className="font-mono text-[10px] uppercase tracking-widest opacity-40 font-bold block">Original</span>
                              <div className="p-6 rounded-3xl bg-black/5 border border-black/5 italic opacity-60">
                                {originalInput}
                              </div>
                            </div>
                            <div className="space-y-4">
                              <span className="font-mono text-[10px] uppercase tracking-widest text-blue-500 font-bold block">Transformed</span>
                              <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10">
                                <Markdown>{output}</Markdown>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Markdown>{output}</Markdown>
                        )}
                      </div>
                      <div className="pt-8 flex items-center justify-between border-t transition-colors" style={{ borderColor: theme.border }}>
                        <div className="flex gap-3">
                          <button
                            onClick={useOutput}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold hover:bg-white/10 transition-all"
                            style={{ borderColor: theme.border }}
                          >
                            <RotateCcw size={14} />
                            Use as Input
                          </button>
                        </div>
                        <span className="font-mono text-[10px] opacity-30 uppercase tracking-widest">
                          Output: {output.length} chars
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                      <Logo size={80} className="mb-6" />
                      <h3 className="mt-6 font-sans text-2xl font-bold">Awaiting Input</h3>
                      <p className="mt-2 text-sm max-w-xs">Your transformed writing will appear here once you click Rewrite.</p>
                    </div>
                  )}
                </motion.div>
              ) : null}

              {/* ANALYSIS TAB */}
              {activePanel === "analysis" && !showCompare && (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {analysing ? (
                    <div className="space-y-8">
                      <div className="flex items-center gap-3 text-amber-500">
                        <Search className="spin" size={20} />
                        <span className="font-mono text-xs uppercase tracking-widest font-bold">Deep scanning...</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 rounded-2xl animate-pulse" style={{ background: theme.border }} />
                        <div className="h-24 rounded-2xl animate-pulse" style={{ background: theme.border }} />
                      </div>
                    </div>
                  ) : analysis ? (
                    <div className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <h4 className="font-mono text-[10px] uppercase tracking-widest opacity-40">Performance Metrics</h4>
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
                            { l: "Avg Sentence", v: `${analysis.avg_sentence_length?.toFixed(1)} w` },
                            { l: "Passive Voice", v: analysis.passive_voice_count },
                          ].map(s => (
                            <div key={s.l} className="p-4 rounded-2xl border shadow-sm transition-colors" style={{ background: theme.card, borderColor: theme.border }}>
                              <span className="block font-mono text-[8px] uppercase tracking-widest opacity-40 mb-1">{s.l}</span>
                              <span className="text-sm font-bold">{s.v}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {analysis.banned_words?.length > 0 && (
                        <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                          <div className="flex items-center gap-2 text-amber-600 mb-4">
                            <AlertCircle size={16} />
                            <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Buzzword Alert</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {analysis.banned_words.map(w => (
                              <span key={w} className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-700 text-[10px] font-mono font-bold">
                                {w}
                              </span>
                            ))}
                          </div>
                          <p className="mt-4 text-[11px] opacity-60 italic">These words often signal corporate fluff. Consider replacing them with more direct language.</p>
                        </div>
                      )}

                      <div className="space-y-4">
                        {analysis.summary && (
                          <div className="p-6 rounded-2xl border transition-colors" style={{ background: isDark ? "rgba(45,206,137,0.05)" : "#f0fdf4", borderColor: isDark ? "rgba(45,206,137,0.2)" : "#dcfce7" }}>
                            <div className="flex items-center gap-2 text-green-600 mb-2">
                              <Check size={16} />
                              <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Key Strength</span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: isDark ? "#88ebbc" : "#166534" }}>{analysis.summary}</p>
                          </div>
                        )}
                        {analysis.weakness && (
                          <div className="p-6 rounded-2xl border transition-colors" style={{ background: isDark ? "rgba(245,54,92,0.05)" : "#fef2f2", borderColor: isDark ? "rgba(245,54,92,0.2)" : "#fee2e2" }}>
                            <div className="flex items-center gap-2 text-red-600 mb-2">
                              <AlertCircle size={16} />
                              <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Critical Weakness</span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: isDark ? "#fca5a5" : "#991b1b" }}>{analysis.weakness}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                      <Search size={64} strokeWidth={1} />
                      <h3 className="mt-6 font-sans text-2xl font-bold">No Analysis</h3>
                      <p className="mt-2 text-sm max-w-xs">Run an analysis to see deep insights into your writing style.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ISSUES TAB */}
              {activePanel === "issues" && !showCompare && (
                <motion.div
                  key="issues"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {analysis?.issues && analysis.issues.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.issues.map((issue: AnalysisIssue, i: number) => (
                        <motion.div
                          key={i}
                          whileHover={{ y: -2 }}
                          className="p-6 rounded-3xl border shadow-sm hover:shadow-xl transition-all group"
                          style={{ background: theme.card, borderColor: theme.border }}
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                issue.type === "Grammar" ? "bg-red-500/10 text-red-500" :
                                issue.type === "Clarity" ? "bg-amber-500/10 text-amber-500" :
                                issue.type === "Tone" ? "bg-purple-500/10 text-purple-500" :
                                "bg-blue-500/10 text-blue-500"
                              }`}>
                                {issue.type === "Grammar" ? <AlertCircle size={16} /> :
                                 issue.type === "Clarity" ? <Zap size={16} /> :
                                 issue.type === "Tone" ? <User size={16} /> :
                                 <ShieldCheck size={16} />}
                              </div>
                              <span className="font-mono text-[10px] uppercase tracking-widest font-bold opacity-40">
                                {issue.type}
                              </span>
                            </div>
                            <span className="text-[10px] opacity-20 font-mono italic max-w-[120px] truncate">&quot;{issue.text}&quot;</span>
                          </div>
                          <p className="text-sm font-medium leading-relaxed mb-6">{issue.suggestion}</p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(issue.suggestion);
                            }}
                            className="w-full py-2 rounded-xl bg-black/5 hover:bg-black/10 text-[10px] font-mono uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2"
                          >
                            <Copy size={12} />
                            Copy Suggestion
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                      <Zap size={64} strokeWidth={1} />
                      <h3 className="mt-6 font-sans text-2xl font-bold">All Clear</h3>
                      <p className="mt-2 text-sm max-w-xs">No significant issues detected in your text.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* ANALYSIS MODAL */}
      <AnimatePresence>
        {showAnalysisModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAnalysisModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl glass shadow-2xl z-[110] rounded-[32px] overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b flex items-center justify-between" style={{ borderColor: theme.border }}>
                <div className="flex items-center gap-3">
                  <Activity className="text-blue-500" />
                  <h2 className="font-sans text-2xl font-bold">Quick Scan Results</h2>
                </div>
                <button onClick={() => setShowAnalysisModal(false)} className="p-2 rounded-full hover:bg-black/5">
                  <XCircle size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {analysing ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Activity className="spin text-blue-500" size={48} />
                    <p className="font-mono text-xs uppercase tracking-widest opacity-40">Scanning your writing...</p>
                  </div>
                ) : analysis ? (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <h4 className="font-mono text-[10px] uppercase tracking-widest opacity-40">Performance Metrics</h4>
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
                          { l: "Avg Sentence", v: `${analysis.avg_sentence_length?.toFixed(1)} w` },
                          { l: "Passive Voice", v: analysis.passive_voice_count },
                        ].map(s => (
                          <div key={s.l} className="p-4 rounded-2xl border shadow-sm glass-card">
                            <span className="block font-mono text-[8px] uppercase tracking-widest opacity-40 mb-1">{s.l}</span>
                            <span className="text-sm font-bold">{s.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {analysis.banned_words?.length > 0 && (
                      <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                        <div className="flex items-center gap-2 text-amber-600 mb-4">
                          <AlertCircle size={16} />
                          <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Buzzword Alert</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysis.banned_words.map(w => (
                            <span key={w} className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-700 text-[10px] font-mono font-bold">
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      {analysis.summary && (
                        <div className="p-6 rounded-2xl border glass-card" style={{ borderColor: isDark ? "rgba(45,206,137,0.2)" : "#dcfce7" }}>
                          <div className="flex items-center gap-2 text-green-600 mb-2">
                            <Check size={16} />
                            <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Key Strength</span>
                          </div>
                          <p className="text-sm leading-relaxed">{analysis.summary}</p>
                        </div>
                      )}
                      {analysis.weakness && (
                        <div className="p-6 rounded-2xl border glass-card" style={{ borderColor: isDark ? "rgba(245,54,92,0.2)" : "#fee2e2" }}>
                          <div className="flex items-center gap-2 text-red-600 mb-2">
                            <AlertCircle size={16} />
                            <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Critical Weakness</span>
                          </div>
                          <p className="text-sm leading-relaxed">{analysis.weakness}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="p-6 border-t flex justify-end" style={{ borderColor: theme.border }}>
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="px-8 py-3 rounded-full bg-black text-white font-mono text-[11px] uppercase tracking-widest font-bold"
                  style={{ background: theme.text, color: theme.bg }}
                >
                  Close Scan
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* HISTORY DRAWER */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md shadow-2xl z-[70] flex flex-col transition-colors"
              style={{ background: theme.bg }}
            >
              <div className="p-6 border-b flex items-center justify-between transition-colors" style={{ borderColor: theme.border }}>
                <h2 className="font-sans text-xl font-bold">History</h2>
                <button onClick={() => setShowHistory(false)} className="p-2 rounded-full hover:bg-black/5">
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {history.map(h => (
                  <button
                    key={h.id}
                    onClick={() => {
                      setInput(h.input_full || h.input);
                      setOutput(h.output);
                      setMode(h.mode);
                      setShowHistory(false);
                      setActivePanel("rewrite");
                    }}
                    className="w-full text-left p-5 rounded-2xl border hover:bg-black/5 transition-all group glass-card relative overflow-hidden"
                    style={{ borderColor: theme.border }}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ background: MODE_COLORS[h.mode] }} />
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-black/5" style={{ color: MODE_COLORS[h.mode] }}>
                          {h.mode}
                        </span>
                        <span className="font-mono text-[8px] opacity-30 uppercase tracking-tighter">{h.platform || 'General'}</span>
                      </div>
                      <span className="text-[9px] opacity-30">{h.date}</span>
                    </div>
                    <p className="text-xs font-medium opacity-80 line-clamp-1 mb-1">{h.input.slice(0, 50)}...</p>
                    <p className="text-[10px] opacity-40 line-clamp-2 leading-relaxed italic">&quot;{h.output.slice(0, 100)}...&quot;</p>
                  </button>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-20 opacity-20">
                    <HistoryIcon size={48} className="mx-auto mb-4" />
                    <p className="text-sm">No history yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
