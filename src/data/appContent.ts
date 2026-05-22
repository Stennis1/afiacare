import type { AITriageResult } from '../services/aiTriage';
import type { Language, Patient } from '../types/app';

export const samplePatients: Patient[] = [
  { name: 'Ama', age: 26, weeks: 32, reason: 'Headache + swelling', score: 92, district: 'Kumasi' },
  { name: 'Akosua', age: 29, weeks: 36, reason: 'Reduced baby movement', score: 88, district: 'Accra' },
  { name: 'Adjoa', age: 22, weeks: 28, reason: 'Fever and tiredness', score: 65, district: 'Tamale' },
  { name: 'Efua', age: 31, weeks: 30, reason: 'No ANC visit this trimester', score: 60, district: 'Wa' },
  { name: 'Naana', age: 24, weeks: 34, reason: 'Mild swelling', score: 42, district: 'Sunyani' },
];

export const districtData = [
  { district: 'Kumasi', cases: 8 },
  { district: 'Accra', cases: 6 },
  { district: 'Tamale', cases: 4 },
  { district: 'Wa', cases: 3 },
  { district: 'Sunyani', cases: 2 },
];

export const heroImageUrl =
  'https://images.pexels.com/photos/19156256/pexels-photo-19156256.jpeg?auto=compress&cs=tinysrgb&w=1400';
export const clinicImageUrl = '/images/ghana-nurse-pregnant-care.png';
export const ussdCareImageUrl = '/images/ghana-nurse-pregnant-care.png';

export const riskColors: Record<'Low' | 'Medium' | 'High' | 'Emergency', string> = {
  Low: 'bg-emerald-500 text-emerald-900',
  Medium: 'bg-amber-300 text-amber-900',
  High: 'bg-red-500 text-white',
  Emergency: 'bg-slate-950 text-white',
};

export const speechLanguageCodes: Record<Language, string> = {
  English: 'en-US',
  Twi: 'en-US',
  Dagbani: 'en-US',
  Ewe: 'en-US',
};

export const voiceLanguageCodes: Record<Language, string> = {
  English: 'en-US',
  Twi: 'en-GH',
  Dagbani: 'dag-GH',
  Ewe: 'ee-GH',
};

export const languagePrompts: Record<Language, string> = {
  English: 'Tap the microphone and describe what is wrong in your own words.',
  Twi: 'Mia microphone no so na ka nea ɛhaw wo wɔ Twi mu.',
  Dagbani: 'Nyɛ microphone ni soli ka mini nyɛ la ka Dagbani ni.',
  Ewe: 'Zi microphone dzi eye nado gblɔ nu si le xaxa na wo le Ewegbe me.',
};

export const voiceFallbackMessage =
  'Voice typing works best in Chrome or Edge with microphone permission enabled.';

export const recordedLanguages: Language[] = ['Twi', 'Dagbani', 'Ewe'];

export const microphoneInstructions: Record<Language, string> = {
  English: 'Press the microphone and say what is wrong with you.',
  Twi: 'Mia microphone no so na ka nea ɛhaw wo.',
  Dagbani: 'Nyɛ microphone ni soli ka mini nyɛ la.',
  Ewe: 'Zi microphone dzi eye nagblɔ nu si le xaxa na wo.',
};

export const spokenMicrophoneInstructions: Partial<Record<Language, string>> = {
  Twi: 'Mee-ah microphone no so, na kah neh-ah eh-haw woh.',
  Dagbani: 'Nyeh microphone ni soli, ka mini nyeh la.',
  Ewe: 'Zi microphone dzi, eye na-gblo nu si le xaxa na wo.',
};

export const patientResponses: Record<Language, Record<AITriageResult['riskLevel'], string>> = {
  English: {
    Emergency:
      'This sounds serious. Please go to the hospital now or call emergency transport. Do not wait at home.',
    High: 'Please go to the clinic or hospital today. These symptoms need urgent attention.',
    Medium: 'Please visit the clinic soon so a nurse or midwife can check you and the baby.',
    Low: 'Continue your antenatal visits. If the symptoms become worse, go to the clinic.',
  },
  Ewe: {
    Emergency:
      'Esia nye nu vevi. Yi dokitafe kaba alo yo ambulance. Megakpo mo le afe me o.',
    High: 'Yi clinic alo dokitafe egbe. Dzesi siawo hia kpekpedenu kaba.',
    Medium: 'Yi clinic le nkeke vovovo me, be nurse alo midwife nakpo wo kple vi la.',
    Low: 'Kpo antenatal visitwo dzi. Ne xaxa la me nuse wu la, yi clinic.',
  },
  Twi: {
    Emergency:
      'Eyi ye haw kɛse. Kɔ ayaresabea seesei anaa frɛ mmoa ntɛm. Ntweɔn wɔ fie.',
    High: 'Kɔ clinic anaa ayaresabea nnɛ. Saa nsɛnkyerɛnne yi hia ntɛmhwɛ.',
    Medium: 'Kɔ clinic nnansa yi mu ma nurse anaa midwife nhwɛ wo ne abofra no.',
    Low: 'Kɔ so kɔ antenatal. Sɛ ɛyɛ den a, kɔ clinic.',
  },
  Dagbani: {
    Emergency:
      'Din ni labi shɛli. Kɔ hospital zaa or ni soli tuma ni nyɛla pam. Da kuli ni yiri.',
    High: 'Kɔ clinic wala hospital biɛhigu. A yelima maa ni nyɛla pam.',
    Medium: 'Kɔ clinic saha din mali ka nurse wala midwife ni labi nima ni bi la.',
    Low: 'Kuli ni antenatal visit. Din yɛla zuɣu, kɔ clinic.',
  },
};

export const spokenPatientResponses: Partial<Record<Language, Record<AITriageResult['riskLevel'], string>>> = {
  Twi: {
    Emergency:
      'Eh-yee yeh haw keh-seh. Koh ah-yah-reh-sah-beh-ah seh-seh-ee, anaa freh mmoah en-tem. En-twen woh fee-eh.',
    High:
      'Koh clinic anaa ah-yah-reh-sah-beh-ah en-neh. Saa en-sen-cheh-ren-neh yi hia en-tem hweh.',
    Medium:
      'Koh clinic en-nan-sah yi mu, ma nurse anaa midwife en-hweh woh neh ah-boh-frah no.',
    Low: 'Koh so koh antenatal. Seh eh-yeh den ah, koh clinic.',
  },
};

export const cleanTwiPatientResponses: Record<AITriageResult['riskLevel'], string> = {
  Emergency: 'Eyi ye haw kese. Ko ayaresabea seesei anaa fre mmoa ntem. Ntwen wo fie.',
  High: 'Ko clinic anaa ayaresabea nne. Saa nsɛnkyerɛnne yi hia ntemhwe.',
  Medium: 'Ko clinic nnansa yi mu ma nurse anaa midwife nhwɛ wo ne abofra no.',
  Low: 'Ko so ko antenatal. Sɛ ɛyɛ den a, ko clinic.',
};
