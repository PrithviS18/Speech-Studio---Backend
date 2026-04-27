import { DeepgramClient } from "@deepgram/sdk";

const deepgram = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

function getDubaiKeywords() {
  return [
    // Areas & Communities
    "Downtown Dubai:5",
    "Palm Jumeirah:8",
    "DIFC:8",
    "Emirates Hills:7",
    "Jumeirah:5",
    "Business Bay:6",
    "Dubai Marina:7",
    "Arabian Ranches:7",
    "Jumeirah Village Circle:7",
    "JVC:6",
    "Dubai Hills:6",
    "Al Barsha:6",
    "Bur Dubai:6",
    "Deira:5",
    "Mirdif:5",
    "Al Quoz:5",
    "Silicon Oasis:6",
    "International City:6",
    "Sports City:5",
    "Motor City:5",
    "Discovery Gardens:5",
    "The Springs:5",
    "The Meadows:5",
    "The Lakes:5",
    "Jumeirah Golf Estates:6",
    "Mudon:5",
    "Damac Hills:6",

    // Landmarks & Buildings
    "Burj Khalifa:9",
    "Burj Al Arab:8",
    "Dubai Opera:6",
    "Dubai Mall:6",
    "Dubai Frame:6",
    "Atlantis:6",

    // Roads
    "Sheikh Zayed Road:7",
    "Al Khail Road:6",
    "Emirates Road:5",
    "Hessa Street:5",

    // UAE Areas & Orgs
    "Abu Dhabi:5",
    "Sharjah:5",
    "Ras Al Khaimah:6",
    "ADNOC:7",
    "Cleveland Clinic Abu Dhabi:7",

    // Currency
    "dirhams:6",
    "AED:5",

    // Real Estate Terms
    "penthouse:5",
    "villa:5",
    "off-plan:6",
    "freehold:5",
    "leasehold:5",
  ];
}

export async function createDeepgramLiveSession() {
  const connection = await deepgram.listen.v1.connect({
    model: "nova-3",
    language: "en-US",
    smart_format: true,
    interim_results: true,
    keyterms: getDubaiKeywords(),
  });

  return connection;
}