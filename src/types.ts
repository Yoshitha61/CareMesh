export type Role = 'doctor' | 'researcher';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  
  // Diabetes Dataset Fields
  glucose: number;
  A1Cresult: 'none' | 'normal' | '>7' | '>8';
  timeInHospital: number;
  numMedications: number;
  
  // Heart Failure Dataset Fields
  ejectionFraction: number;
  serumCreatinine: number;
  serumSodium: number;
  highBloodPressure: boolean;
  smoking: boolean;
  
  // Personalized Medication Fields
  geneticMarkers: string[];
  cholesterol: number;
  steps: number;
  heartRate: number;
  
  riskLevel: 'low' | 'medium' | 'high';
  condition: string;
  personalizedMedicine: string;
  suggestedTreatmentPlan: string;
  lastUpdated: string;
}

export interface AnalysisResult {
  patientId: string;
  timestamp: string;
  recommendations: Treatment[];
  clinicalAlert?: string;
  alertType?: 'info' | 'warning' | 'critical';
  explanation: {
    topFactors: { factor: string; impact: number }[];
  };
}

export interface Treatment {
  id: string;
  name: string;
  success: number;
  risk: number;
}
