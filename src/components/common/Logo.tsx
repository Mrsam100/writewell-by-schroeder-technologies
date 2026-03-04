/** @license SPDX-License-Identifier: Apache-2.0 */
import React from "react";

export const Logo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <div
    className={`flex items-center justify-center rounded-[20%] bg-gradient-to-b from-[#ffb74d] to-[#f57c00] shadow-sm ${className}`}
    style={{ width: size, height: size }}
  >
    <svg
      width={size * 0.6}
      height={size * 0.6}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.5 2.5L21.5 5.5L19 8L16 5L18.5 2.5ZM15 6L18 9L7 20H4V17L15 6Z"
        fill="white"
      />
    </svg>
  </div>
);
