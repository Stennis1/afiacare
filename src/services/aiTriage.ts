export interface AITriageResult {
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Emergency';
  possibleCondition: string;
  topReasons: string[];
  recommendedAction: string;
  patientMessage: string;
  chwAlertMessage: string;
  clinic: string;
  confidence: number;
  aiInsight?: string;
  priorityPrediction?: string;
}

export type SupportedLanguage = 'English' | 'Twi' | 'Dagbani' | 'Ewe';

const localLanguageSymptomMap: Record<SupportedLanguage, Record<string, string>> = {
  English: {},
  Twi: {
    mogya: 'bleeding',
    'mogya retu': 'bleeding',
    'me ti yare': 'headache',
    tipae: 'headache',
    'me ho ahon': 'swelling',
    ahon: 'swelling',
    atiridii: 'fever',
    hurae: 'fever',
    'abofra no ntutu ne ho': 'reduced baby movement',
    'abofra no ntutu': 'reduced baby movement',
    'yam yare': 'abdominal pain',
    'me yam yare': 'abdominal pain',
    'mebr3': 'tired',
    'menkɔɔ anc': 'no anc',
    'menkɔɔ antenatal': 'no antenatal',
  },
  Dagbani: {
    zuli: 'bleeding',
    'n ti yelima': 'headache',
    yelima: 'headache',
    dihigu: 'swelling',
    wum: 'fever',
    'bi niŋ mali yɛla': 'reduced baby movement',
    'bi ni mali yela': 'reduced baby movement',
    'puhiri yɛla': 'abdominal pain',
    'n nyaŋ': 'tired',
    'ka anc': 'no anc',
    'ka antenatal': 'no antenatal',
  },
  Ewe: {
    'wu le dzom': 'bleeding',
    'awu le dzom': 'bleeding',
    'ta le vevem': 'headache',
    taveve: 'headache',
    'nye ta le vevem': 'headache',
    'nu le funem': 'swelling',
    funu: 'swelling',
    asranda: 'fever',
    dzo: 'fever',
    'vi la me tso o': 'reduced baby movement',
    'vi la me ʋu o': 'reduced baby movement',
    'vi la me vu o': 'reduced baby movement',
    'dzi le vevem': 'abdominal pain',
    'me le vevem': 'abdominal pain',
    'me le dzo': 'fever',
    'me vɔ': 'tired',
    'me vo': 'tired',
    'menyi anc o': 'no anc',
    'menyi antenatal o': 'no antenatal',
  },
};

export function normalizeSymptomsForTriage(input: string, language: SupportedLanguage): string {
  const phrases = localLanguageSymptomMap[language];
  const matches = Object.entries(phrases)
    .filter(([phrase]) => input.toLowerCase().includes(phrase.toLowerCase()))
    .map(([, symptom]) => symptom);

  if (matches.length === 0) return input;

  return `${input}\n\nInterpreted symptoms: ${Array.from(new Set(matches)).join(', ')}`;
}

/**
 * Local AI Simulation Engine for Maternal Health Triage
 * 
 * Fully offline, no external API calls required.
 * Provides two modes:
 * - 'demo': Fast rule-based triage
 * - 'live': Advanced local AI simulation with clinical reasoning
 */
export async function analyzeSymptoms(
  input: string,
  mode: 'demo' | 'live' = 'demo',
  language: SupportedLanguage = 'English',
): Promise<AITriageResult> {
  const normalizedInput = normalizeSymptomsForTriage(input, language);

  // Add realistic delay to simulate AI processing
  if (mode === 'live') {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return localAISimulation(normalizedInput);
  }

  // Demo mode: fast rule-based triage
  return ruleBasedTriage(normalizedInput);
}

/**
 * Advanced local AI simulation engine with clinical reasoning
 * Mimics sophisticated AI analysis without external APIs
 */
function localAISimulation(input: string): AITriageResult {
  const normalized = input.toLowerCase();
  const symptoms = parseSymptoms(normalized);
  const riskFactors = analyzeRiskFactors(symptoms);
  const clinicalContext = assessClinicalContext(symptoms);

  // Calculate risk score with weighted factors
  const riskScore = calculateAdvancedRiskScore(riskFactors, clinicalContext);
  const riskLevel = determineRiskLevel(riskScore);

  // Generate AI-style insights and reasoning
  const possibleCondition = generateDiagnosis(riskFactors);
  const topReasons = generateTopReasons(riskFactors, riskScore);
  const aiInsight = generateClinicalInsight(riskFactors, clinicalContext);
  const priorityPrediction = generatePriorityPrediction(riskScore, possibleCondition);

  return {
    riskScore,
    riskLevel,
    possibleCondition,
    topReasons,
    recommendedAction: generateRecommendation(riskScore, possibleCondition, riskFactors),
    patientMessage: generatePatientMessage(riskLevel, possibleCondition),
    chwAlertMessage: generateCHWAlert(riskLevel, possibleCondition, topReasons),
    clinic: selectClinic(riskLevel),
    confidence: calculateConfidence(riskFactors, normalized),
    aiInsight,
    priorityPrediction,
  };
}

interface SymptomProfile {
  [key: string]: number;
}

interface RiskFactors {
  emergencyIndicators: string[];
  severityMarkers: string[];
  chronicity: string[];
  comorbidities: string[];
  accessBarriers: string[];
}

function parseSymptoms(input: string): SymptomProfile {
  const symptoms: SymptomProfile = {};

  // Emergency symptoms (weight: 100)
  symptoms.bleeding = input.includes('bleeding') ? 100 : 0;
  symptoms.seizure = input.includes('seizure') || input.includes('convulsion') ? 100 : 0;
  symptoms.loss = input.includes('loss of consciousness') || input.includes('fainted') ? 100 : 0;

  // High-risk symptoms (weight: 70-90)
  symptoms.headache = input.includes('headache') || input.includes('head pain') ? 75 : 0;
  symptoms.swelling = input.includes('swelling') || input.includes('edema') ? 70 : 0;
  symptoms.reducedMovement =
    input.includes('reduced baby movement') || input.includes('reduced movement') ? 85 : 0;
  symptoms.chestPain = input.includes('chest pain') || input.includes('chest') ? 80 : 0;
  symptoms.severeHeadache = input.includes('severe headache') ? 95 : 0;

  // Medium-risk symptoms (weight: 40-60)
  symptoms.fever = input.includes('fever') || input.includes('temperature') ? 55 : 0;
  symptoms.vaginalPain = input.includes('vaginal pain') || input.includes('pelvic pain') ? 60 : 0;
  symptoms.abdominalPain = input.includes('abdominal pain') || input.includes('belly') ? 50 : 0;

  // Low-risk but important (weight: 20-40)
  symptoms.fatigue = input.includes('fatigue') || input.includes('tired') ? 35 : 0;
  symptoms.nausea = input.includes('nausea') || input.includes('vomiting') ? 30 : 0;
  symptoms.noANC =
    input.includes('no anc') ||
    input.includes('no antenatal') ||
    input.includes('missed anc') ||
    input.includes('missed appointment')
      ? 40
      : 0;

  return symptoms;
}

function analyzeRiskFactors(symptoms: SymptomProfile): RiskFactors {
  const factors: RiskFactors = {
    emergencyIndicators: [],
    severityMarkers: [],
    chronicity: [],
    comorbidities: [],
    accessBarriers: [],
  };

  if (symptoms.bleeding > 50) factors.emergencyIndicators.push('Vaginal bleeding');
  if (symptoms.seizure > 50) factors.emergencyIndicators.push('Neurological event');
  if (symptoms.loss > 50) factors.emergencyIndicators.push('Altered consciousness');

  if (symptoms.headache > 50 && symptoms.swelling > 50)
    factors.severityMarkers.push('Preeclampsia pattern');
  if (symptoms.reducedMovement > 50) factors.severityMarkers.push('Fetal distress');
  if (symptoms.fever > 50) factors.severityMarkers.push('Infection risk');
  if (symptoms.chestPain > 50) factors.severityMarkers.push('Cardiorespiratory concern');

  if (symptoms.fatigue > 30) factors.chronicity.push('Chronic fatigue');
  if (symptoms.noANC > 30) factors.accessBarriers.push('Missed antenatal care');

  return factors;
}

function assessClinicalContext(symptoms: SymptomProfile): object {
  const multipleSymptomsPresent = Object.values(symptoms).filter((s) => s > 0).length;

  return {
    symptomBurden: multipleSymptomsPresent,
    acuity: Math.max(...Object.values(symptoms)),
    hasEmergencyFeature: Object.values(symptoms).some((s) => s >= 100),
  };
}

function calculateAdvancedRiskScore(factors: RiskFactors, context: any): number {
  let score = 0;

  // Emergency indicators = 95-100
  if (factors.emergencyIndicators.length > 0) {
    score = 95 + factors.emergencyIndicators.length * 1;
  }

  // Multiple severity markers
  if (factors.severityMarkers.length >= 2) {
    score = Math.max(score, 80 + factors.severityMarkers.length * 5);
  } else if (factors.severityMarkers.length === 1) {
    score = Math.max(score, 70);
  }

  // Access barriers increase effective risk
  if (factors.accessBarriers.length > 0) {
    score = Math.max(score, 50 + factors.accessBarriers.length * 10);
  }

  // Symptom burden multiplier
  if (context.symptomBurden >= 3) {
    score = Math.min(100, score * 1.15);
  }

  return Math.min(100, Math.round(score));
}

function determineRiskLevel(score: number): 'Low' | 'Medium' | 'High' | 'Emergency' {
  if (score >= 85) return 'Emergency';
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

function generateDiagnosis(factors: RiskFactors): string {
  if (factors.emergencyIndicators.length > 0) {
    if (factors.emergencyIndicators.includes('Vaginal bleeding')) return 'Obstetric hemorrhage';
    if (factors.emergencyIndicators.includes('Neurological event')) return 'Eclampsia';
    if (factors.emergencyIndicators.includes('Altered consciousness')) return 'Hypertensive emergency';
  }

  if (
    factors.severityMarkers.includes('Preeclampsia pattern') &&
    factors.severityMarkers.length > 1
  ) {
    return 'Severe preeclampsia';
  }

  if (factors.severityMarkers.includes('Fetal distress')) return 'Fetal compromise';
  if (factors.severityMarkers.includes('Infection risk')) return 'Maternal infection (possible malaria/UTI)';
  if (factors.severityMarkers.includes('Cardiorespiratory concern')) return 'Respiratory infection';

  if (factors.accessBarriers.length > 0) return 'Delayed antenatal care with unknown risk';

  return 'Routine pregnancy monitoring';
}

function generateTopReasons(factors: RiskFactors, score: number): string[] {
  const reasons: string[] = [];

  if (factors.emergencyIndicators.length > 0) {
    reasons.push(`Critical: ${factors.emergencyIndicators.join(', ')}`);
  }

  factors.severityMarkers.slice(0, 2).forEach((marker) => {
    reasons.push(`Risk factor: ${marker}`);
  });

  if (reasons.length < 3 && factors.accessBarriers.length > 0) {
    reasons.push(`Access barrier: ${factors.accessBarriers[0]}`);
  }

  if (reasons.length < 3) {
    reasons.push(`AI Risk Assessment: ${score}/100`);
  }

  return reasons.slice(0, 3);
}

function generateClinicalInsight(factors: RiskFactors, context: any): string {
  if (factors.emergencyIndicators.length > 0) {
    return `Acute emergency detected. Immediate hospitalization required. Clinical features indicate potential life-threatening complication.`;
  }

  if (factors.severityMarkers.length >= 2) {
    return `Multiple concurrent risk factors identified. Elevated risk of maternal and/or fetal compromise. Recommend urgent specialist evaluation.`;
  }

  if (factors.accessBarriers.length > 0) {
    return `Access to care appears limited. Recommend proactive scheduling and transport support to ensure timely assessment.`;
  }

  return `Pregnancy parameters within expected range for routine monitoring. Continue regular antenatal surveillance.`;
}

function generatePriorityPrediction(score: number, condition: string): string {
  if (score >= 85) return `CRITICAL PRIORITY: ${condition} - Requires immediate intervention`;
  if (score >= 70) return `HIGH PRIORITY: ${condition} - Urgent evaluation needed within 24 hours`;
  if (score >= 40) return `MODERATE PRIORITY: ${condition} - Schedule clinic visit within 48-72 hours`;
  return `ROUTINE: ${condition} - Standard antenatal follow-up recommended`;
}

function generateRecommendation(score: number, condition: string, factors: RiskFactors): string {
  if (score >= 85) {
    return `EMERGENCY REFERRAL: Contact ambulance service immediately. Transport to tertiary facility with maternal ICU. Notify obstetric team of ${condition}.`;
  }

  if (score >= 70) {
    if (factors.severityMarkers.includes('Preeclampsia pattern')) {
      return `Same-day referral to hospital. Assess BP, proteinuria, reflexes. Prepare for possible delivery or management protocols.`;
    }
    if (factors.severityMarkers.includes('Fetal distress')) {
      return `Urgent fetal evaluation: NST/CTG, ultrasound. Contact hospital obstetrics. Arrange emergency transport if abnormal.`;
    }
    return `Next-day appointment with obstetrician or senior midwife. Baseline investigations and clinical assessment.`;
  }

  if (score >= 40) {
    return `Schedule clinic visit within 48-72 hours. Provide transport support if needed. CHW to conduct home assessment if feasible.`;
  }

  return `Continue routine antenatal care. Attend next scheduled clinic. Patient education on warning signs and when to seek care.`;
}

function generatePatientMessage(level: string, condition: string): string {
  const messages: { [key: string]: string } = {
    Emergency:
      'This is a medical emergency. Go to the hospital immediately or call emergency services. Do not delay.',
    High: 'You should go to the clinic or hospital today for evaluation. These symptoms need urgent attention.',
    Medium: 'Please visit the clinic soon, within the next few days, to be checked and monitored.',
    Low: 'Continue your regular antenatal visits. Watch for warning signs and seek care if anything feels unusual.',
  };

  return messages[level] || messages.Low;
}

function generateCHWAlert(level: string, condition: string, reasons: string[]): string {
  if (level === 'Emergency') {
    return `EMERGENCY: Patient has ${condition}. Contact emergency transport immediately. Notify district hospital. This is life-threatening.`;
  }

  if (level === 'High') {
    return `HIGH-RISK ALERT: ${condition} detected. Contact patient today. Arrange clinic appointment or home visit for urgent assessment.`;
  }

  if (level === 'Medium') {
    return `PRIORITY: ${condition} - Patient needs clinic follow-up within 48-72 hours. Provide transport support. Document findings.`;
  }

  return `ROUTINE: Patient stable. Encourage regular ANC attendance. Provide health education on ${reasons.join(', ')}.`;
}

function selectClinic(level: string): string {
  const clinics: { [key: string]: string } = {
    Emergency: 'Tertiary Referral Hospital with Obstetric ICU',
    High: 'District Hospital - Maternal Ward',
    Medium: 'Health Center or Clinic with ANC',
    Low: 'Community Health Post',
  };

  return clinics[level] || clinics.Low;
}

function calculateConfidence(factors: RiskFactors, input: string): number {
  const totalFactors = factors.emergencyIndicators.length + factors.severityMarkers.length;
  const inputLength = input.split(' ').length;

  // Base confidence on number of detected factors and input detail
  let confidence = 0.75;
  if (totalFactors >= 2) confidence += 0.15;
  if (inputLength > 5) confidence += 0.05;

  return Math.min(0.99, Math.round(confidence * 100) / 100);
}

/**
 * Fast rule-based triage for Demo Mode
 */
function ruleBasedTriage(input: string): AITriageResult {
  const normalized = input.toLowerCase();
  const hasHeadache = normalized.includes('headache');
  const hasSwelling = normalized.includes('swelling');
  const hasBleeding = normalized.includes('bleeding');
  const hasFever = normalized.includes('fever');
  const hasReduced =
    normalized.includes('reduced baby movement') ||
    normalized.includes('reduced movement') ||
    normalized.includes('baby movement');
  const hasNoAnc =
    normalized.includes('no anc visit') ||
    normalized.includes('no anc') ||
    normalized.includes('no antenatal');

  if (hasBleeding) {
    return {
      riskScore: 95,
      riskLevel: 'Emergency',
      possibleCondition: 'Obstetric hemorrhage',
      topReasons: [
        'Vaginal bleeding reported',
        'Potential hemorrhage risk',
        'Emergency referral required',
      ],
      recommendedAction:
        'Emergency referral. Contact ambulance immediately and transport to hospital.',
      patientMessage: 'Go to the hospital now. This is an emergency.',
      chwAlertMessage: 'EMERGENCY: Bleeding. Activate ambulance and prepare for transport.',
      clinic: 'Tertiary Hospital Emergency',
      confidence: 0.98,
    };
  }

  if (hasHeadache && hasSwelling) {
    return {
      riskScore: 80,
      riskLevel: 'High',
      possibleCondition: 'Severe preeclampsia',
      topReasons: ['Headache + swelling', 'Signs of preeclampsia', 'Urgent evaluation needed'],
      recommendedAction:
        'Same-day clinic visit. Check blood pressure. Prepare for possible referral.',
      patientMessage: 'Visit the clinic today for blood pressure check and evaluation.',
      chwAlertMessage: 'High-risk: preeclampsia signs. Arrange urgent clinic visit.',
      clinic: 'Hospital Maternal Ward',
      confidence: 0.92,
    };
  }

  if (hasReduced) {
    return {
      riskScore: 82,
      riskLevel: 'High',
      possibleCondition: 'Fetal distress',
      topReasons: [
        'Reduced baby movement',
        'Possible fetal compromise',
        'Needs urgent monitoring',
      ],
      recommendedAction: 'Urgent fetal evaluation and monitoring. Arrange hospital assessment.',
      patientMessage: 'Go to the health center now to check on your baby.',
      chwAlertMessage: 'High-risk: reduced fetal movement. Urgent clinic referral.',
      clinic: 'Hospital with fetal monitoring',
      confidence: 0.89,
    };
  }

  if (hasFever) {
    return {
      riskScore: 55,
      riskLevel: 'Medium',
      possibleCondition: 'Possible infection',
      topReasons: ['Fever reported', 'Infection risk', 'Needs screening'],
      recommendedAction: 'Clinic visit for fever assessment and infection screening.',
      patientMessage: 'Visit the clinic for fever check and follow-up.',
      chwAlertMessage: 'Medium-risk: fever. Follow-up for infection screening.',
      clinic: 'Health Center',
      confidence: 0.85,
    };
  }

  if (hasNoAnc) {
    return {
      riskScore: 50,
      riskLevel: 'Medium',
      possibleCondition: 'Delayed antenatal care',
      topReasons: ['No ANC visit', 'Missed routine screening', 'Increased risk'],
      recommendedAction: 'Schedule immediate ANC appointment. Conduct baseline screening.',
      patientMessage: 'It is important you attend ANC soon to keep you and your baby safe.',
      chwAlertMessage: 'Medium-risk: missed ANC. Support scheduling appointment.',
      clinic: 'Community Clinic',
      confidence: 0.84,
    };
  }

  return {
    riskScore: 25,
    riskLevel: 'Low',
    possibleCondition: 'Routine pregnancy',
    topReasons: ['No high-risk symptoms', 'Routine monitoring', 'Standard care'],
    recommendedAction: 'Continue regular antenatal care and watch for warning signs.',
    patientMessage:
      'Your symptoms are low-risk. Continue regular ANC visits and report any changes.',
    chwAlertMessage: 'Low-risk: routine care recommended.',
    clinic: 'Community Health Post',
    confidence: 0.95,
  };
}
