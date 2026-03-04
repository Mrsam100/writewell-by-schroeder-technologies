/** @license SPDX-License-Identifier: Apache-2.0 */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Zap } from "lucide-react";
import { rewriteText } from "../../services/gemini";

export const LiveDemo = () => {
  const [text, setText] = useState("We are excited to announce our new product which will help you save time and money.");
  const [rewriting, setRewriting] = useState(false);
  const [result, setResult] = useState("");

  const demoRewrite = async () => {
    setRewriting(true);
    setResult("");
    try {
      const output = await rewriteText({
        input: text,
        mode: "AUTHORITY",
        intent: "Persuade",
        audience: "General Public",
        platform: "General",
        customVoice: "",
      });
      setResult(output || "Transformation complete.");
    } catch {
      setResult("Stop bleeding resources. Our new engine eliminates operational friction, reclaiming 40% of your team's productive capacity.");
    }
    setRewriting(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass rounded-[40px] p-8 md:p-12 border border-white/10 shadow-3xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 opacity-30" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-40 font-bold">Input Draft</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500/20" />
              <div className="w-2 h-2 rounded-full bg-amber-500/20" />
              <div className="w-2 h-2 rounded-full bg-green-500/20" />
            </div>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full h-32 bg-transparent outline-none resize-none font-light text-sm leading-relaxed opacity-60 focus:opacity-100 transition-opacity"
          />
          <button
            onClick={demoRewrite}
            disabled={rewriting}
            className="w-full py-4 rounded-full bg-blue-500 text-white font-mono text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {rewriting ? <Sparkles size={14} className="spin" /> : <Zap size={14} />}
            {rewriting ? "Processing..." : "Test the Engine"}
          </button>
        </div>
        <div className="space-y-6 border-t md:border-t-0 md:border-l border-white/5 pt-12 md:pt-0 md:pl-12">
          <span className="font-mono text-[10px] uppercase tracking-widest text-blue-500 font-bold">WriteWell Transformation</span>
          <div className="min-h-[128px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {rewriting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <div className="h-3 bg-white/5 rounded-full w-full animate-pulse" />
                  <div className="h-3 bg-white/5 rounded-full w-[90%] animate-pulse" />
                  <div className="h-3 bg-white/5 rounded-full w-[95%] animate-pulse" />
                </motion.div>
              ) : result ? (
                <motion.p
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-medium leading-relaxed"
                >
                  {result}
                </motion.p>
              ) : (
                <p className="text-sm opacity-20 italic">Click the button to see the transformation...</p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
