const CORRECTIONS = [
  [/\bDIFIC\b/gi, "DIFC"],
  [/\bD\.I\.F\.C\b/gi, "DIFC"],
  [/\bpulm\s+jumeira\b/gi, "Palm Jumeirah"],
  [/\bpalm\s+jumeriah\b/gi, "Palm Jumeirah"],
  [/\bjumeria\b/gi, "Jumeirah"],
  [/\bburj\s+kalifa\b/gi, "Burj Khalifa"],
  [/\bburj\s+khaleepha\b/gi, "Burj Khalifa"],
  [/\bemirates\s+hill\b/gi, "Emirates Hills"],
  [/\bdowntown\s+do+bai\b/gi, "Downtown Dubai"],
  [/\bjumeira\s+village\s+circle\b/gi, "Jumeirah Village Circle"],
  [/\bJ\.V\.C\b/gi, "JVC"],
  [/\barabian\s+ranch\b/gi, "Arabian Ranches"],
  [/\bdubai\s+hill\b/gi, "Dubai Hills"],
  [/\bbusiness\s+bay(?!s)\b/gi, "Business Bay"],
  [/\bsheikh\s+zayed(?!\s+road)\b/gi, "Sheikh Zayed Road"],

  // Currency
  [/\bdirham(s)?\b/gi, "dirhams"],
  [/\ba\.e\.d\b/gi, "AED"],

  // Organisations
  [/\bA\.D\.N\.O\.C\b/gi, "ADNOC"],
  [/\bad\s+noc\b/gi, "ADNOC"],
  [/\bcleveland\s+clinic\b/gi, "Cleveland Clinic Abu Dhabi"],
];

export function applyDubaiCorrections(text) {
  // Normalize spacing
  let corrected = text.replace(/\s+/g, " ").trim();

  for (const [pattern, replacement] of CORRECTIONS) {
    corrected = corrected.replace(pattern, replacement);
  }

  return corrected;
}