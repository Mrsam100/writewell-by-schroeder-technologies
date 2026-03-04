/** @license SPDX-License-Identifier: Apache-2.0 */
import { motion } from "motion/react";
import { C } from "../../constants";

export const Score = ({ value, label, color }: { value: number, label: string, color?: string }) => (
  <div className="py-3">
    <div className="flex justify-between mb-1.5">
      <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-black/50">{label}</span>
      <span className="font-mono text-xs font-medium" style={{ color: color || C.text }}>{value}</span>
    </div>
    <div className="h-0.5 bg-black/5 overflow-hidden rounded-full">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="h-full"
        style={{ background: color || C.text }}
      />
    </div>
  </div>
);
