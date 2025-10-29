export interface GeneralInfo {
  totalCost: string | null;
  maxValidity: string | null;
  processingTime: string | null;
  interviewRequired: boolean | null;
  onlineApplication: boolean | null;
  biometricsRequired: boolean | null;
}

export interface VisaType {
  code: string;
  name: string;
  description: string;
  cost?: string;
  icon?: string;
  duration?: string;
  validity?: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  url?: string;
  estimatedTime?: string;
}

export interface ApprovalTip {
  title: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface HealthInfo {
  mandatoryVaccines: string[];
  recommendedVaccines?: string[];
  healthRisks?: string[];
  healthRequirements?: string[];
}

export interface SecurityInfo {
  dangerLevel: 'Baixo' | 'Médio' | 'Alto' | 'Desconhecido';
  travelAdvisory?: string;
  areasToAvoid?: string[];
  criticalWarnings?: string[];
  dangerLevelSource?: string;
  emergencyContacts?: { [key: string]: string };
}

export enum AutomationStatus {
  PENDING = 'PENDING',
  OK = 'OK',
  ERROR = 'ERROR',
}

export interface CountryVisaInfo {
  id: string; // uuid in DB
  country: string;
  country_code: string;
  flag_emoji: string;
  slug: string;
  general_info: GeneralInfo | null;
  visa_types: VisaType[];
  required_documents: string[];
  process_steps: ProcessStep[];
  approval_tips: ApprovalTip[];
  health_info: HealthInfo | null;
  security_info: SecurityInfo | null;
  last_verified: string;
  data_source: string;
  automation_status: AutomationStatus;
  priority_level: number;
  official_visa_link: string | null;
  og_image_url: string | null;
  
  // New fields from schema
  region?: string | null;
  meta_description?: string | null;
  created_at?: string;
  updated_at?: string;
  is_territory?: boolean;
}

export type Language = 'pt' | 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';
