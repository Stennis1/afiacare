import type { AITriageResult, SupportedLanguage } from './aiTriage';

export interface LocalLanguagePhrase {
  id: string;
  label: string;
  text: string;
  englishSymptoms: string;
  response: string;
  riskLevel: AITriageResult['riskLevel'];
}

export const localLanguagePhrases: Partial<Record<SupportedLanguage, LocalLanguagePhrase[]>> = {
  Twi: [
    {
      id: 'twi-headache-swelling',
      label: 'Headache and swelling',
      text: 'Me ti yare na me nan nso ahon.',
      englishSymptoms: 'headache and swelling',
      riskLevel: 'High',
      response: 'Ko clinic anaa ayaresabea nne. Saa nsɛnkyerɛnne yi hia ntemhwe.',
    },
    {
      id: 'twi-bleeding',
      label: 'Bleeding',
      text: 'Mogya retu me.',
      englishSymptoms: 'bleeding',
      riskLevel: 'Emergency',
      response: 'Eyi ye haw kese. Ko ayaresabea seesei anaa fre mmoa ntem. Ntwen wo fie.',
    },
    {
      id: 'twi-reduced-movement',
      label: 'Baby movement reduced',
      text: 'Abofra no ntutu ne ho se kan no.',
      englishSymptoms: 'reduced baby movement',
      riskLevel: 'High',
      response: 'Ko health center anaa hospital seesei na wonhwe abofra no. Mma entwen.',
    },
    {
      id: 'twi-fever',
      label: 'Fever',
      text: 'Atiridii ne hurae rehaw me.',
      englishSymptoms: 'fever and chills',
      riskLevel: 'Medium',
      response: 'Ko clinic nnansa yi mu ma nurse anaa midwife nhwɛ wo ne abofra no.',
    },
    {
      id: 'twi-stomach-pain',
      label: 'Stomach pain',
      text: 'Me yam yare me paa.',
      englishSymptoms: 'abdominal pain',
      riskLevel: 'Medium',
      response: 'Ko clinic nnansa yi mu. Sɛ ɛyɛ den paa a, ko hospital ntɛm.',
    },
  ],
  Dagbani: [
    {
      id: 'dag-headache-swelling',
      label: 'Headache and swelling',
      text: 'N ti yelima ka n noli dihigu.',
      englishSymptoms: 'headache and swelling',
      riskLevel: 'High',
      response: 'Kɔ clinic wala hospital biɛhigu. A yɛla maa ni nyɛla pam.',
    },
    {
      id: 'dag-bleeding',
      label: 'Bleeding',
      text: 'Zuli ni ti ma.',
      englishSymptoms: 'bleeding',
      riskLevel: 'Emergency',
      response: 'Din ni labi shɛli. Kɔ hospital zaa wala soli ambulance. Da kuli ni yiri.',
    },
    {
      id: 'dag-reduced-movement',
      label: 'Baby movement reduced',
      text: 'Bi la ka mali yɛla pam.',
      englishSymptoms: 'reduced baby movement',
      riskLevel: 'High',
      response: 'Kɔ health center wala hospital zaa ka ba labi bi la.',
    },
    {
      id: 'dag-fever',
      label: 'Fever',
      text: 'Wum ni ti ma.',
      englishSymptoms: 'fever',
      riskLevel: 'Medium',
      response: 'Kɔ clinic saha din mali ka nurse wala midwife ni labi nima ni bi la.',
    },
    {
      id: 'dag-stomach-pain',
      label: 'Stomach pain',
      text: 'N puhiri yɛla pam.',
      englishSymptoms: 'abdominal pain',
      riskLevel: 'Medium',
      response: 'Kɔ clinic saha din mali. Din yɛla zuɣu pam, kɔ hospital zaa.',
    },
  ],
  Ewe: [
    {
      id: 'ewe-headache-swelling',
      label: 'Headache and swelling',
      text: 'Nye ta le vevem eye nye afɔwo funu.',
      englishSymptoms: 'headache and swelling',
      riskLevel: 'High',
      response: 'Yi clinic alo dokitafe egbe. Dzesi siawo hia kpekpedenu kaba.',
    },
    {
      id: 'ewe-bleeding',
      label: 'Bleeding',
      text: 'Wu le dzom.',
      englishSymptoms: 'bleeding',
      riskLevel: 'Emergency',
      response: 'Esia nye nu vevi. Yi dokitafe kaba alo yo ambulance. Megakpo mo le afe me o.',
    },
    {
      id: 'ewe-reduced-movement',
      label: 'Baby movement reduced',
      text: 'Vi la me vu o abe tsã ene o.',
      englishSymptoms: 'reduced baby movement',
      riskLevel: 'High',
      response: 'Yi health center alo hospital kaba be woakpo vi la. Megawɔ atam o.',
    },
    {
      id: 'ewe-fever',
      label: 'Fever',
      text: 'Asranda le nye ŋu.',
      englishSymptoms: 'fever',
      riskLevel: 'Medium',
      response: 'Yi clinic le ŋkeke vovovo me, be nurse alo midwife nakpo wo kple vi la.',
    },
    {
      id: 'ewe-stomach-pain',
      label: 'Stomach pain',
      text: 'Dzi le vevem nam.',
      englishSymptoms: 'abdominal pain',
      riskLevel: 'Medium',
      response: 'Yi clinic kaba. Ne vevesese la sẽ ŋutɔ la, yi hospital kaba.',
    },
  ],
};
