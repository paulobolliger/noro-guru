export interface WaitlistLead {
  id: string;
  email: string;
  whatsapp: string;
  teamSize: '1' | '2-5' | '6-15' | '15+';
  timestamp: string;
  userAgent?: string;
  notes?: string;
}

export interface FeedbackMessage {
  type: 'success' | 'error';
  text: string;
}
