/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from "jspdf";

export const exportPDF = (output: string, mode: string, platform: string, intent: string) => {
  if (!output) return;
  const doc = new jsPDF();
  const splitText = doc.splitTextToSize(output, 180);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`WriteWell Rewrite - ${mode} Mode`, 10, 10);
  doc.setFontSize(10);
  doc.text(`Platform: ${platform} | Intent: ${intent}`, 10, 16);
  doc.line(10, 20, 200, 20);
  doc.setFontSize(11);
  doc.text(splitText, 10, 30);
  doc.save(`writewell-rewrite-${Date.now()}.pdf`);
};

export const exportTXT = (output: string) => {
  if (!output) return;
  const element = document.createElement("a");
  const file = new Blob([output], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = `writewell-rewrite-${Date.now()}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
