import React, { useState } from 'react';
import { X, User, Activity, Dna, Heart, Footprints, ClipboardList } from 'lucide-react';
import { Patient } from '../types';

interface PatientFormProps {
  onSubmit: (patient: Omit<Patient, 'id' | 'lastUpdated' | 'riskLevel' | 'personalizedMedicine' | 'suggestedTreatmentPlan'>) => void;
  onCancel: () => void;
  isPredicting?: boolean;
}

export default function PatientForm({ onSubmit, onCancel, isPredicting }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: 40,
    gender: 'male' as 'male' | 'female' | 'other',
    condition: '',
    glucose: 100,
    A1Cresult: 'none' as 'none' | 'normal' | '>7' | '>8',
    timeInHospital: 3,
    numMedications: 10,
    ejectionFraction: 50,
    serumCreatinine: 1.0,
    serumSodium: 140,
    highBloodPressure: false,
    smoking: false,
    cholesterol: 180,
    geneticMarkers: [] as string[],
    steps: 5000,
    heartRate: 70
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleMarker = (marker: string) => {
    setFormData(prev => ({
      ...prev,
      geneticMarkers: prev.geneticMarkers.includes(marker)
        ? prev.geneticMarkers.filter(m => m !== marker)
        : [...prev.geneticMarkers, marker]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 bg-white">
      {/* Header */}
      <div className="shrink-0 p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Add New Patient</h2>
          <p className="text-sm text-slate-500">Enter patient details and clinical summary.</p>
        </div>
        <button 
          type="button"
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 overscroll-contain">
        
        {/* Section 1: Basic Information */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-medical-600">
            <User size={18} />
            <h3 className="font-bold text-sm uppercase tracking-wider">Basic Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Patient Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Enter full name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Age</label>
                <input 
                  type="number" 
                  min="0" max="120"
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Gender</label>
                <select 
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value as any})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Clinical Summary (Primary Focus) */}
        <section className="space-y-4 p-5 bg-medical-50/50 rounded-2xl border border-medical-100">
          <div className="flex items-center gap-2 text-medical-700">
            <ClipboardList size={18} />
            <h3 className="font-bold text-sm uppercase tracking-wider">Clinical Summary</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Condition in Detail</label>
              <textarea 
                required
                rows={3}
                value={formData.condition}
                onChange={e => setFormData({...formData, condition: e.target.value})}
                placeholder="Describe the patient's current condition, symptoms, and relevant medical history..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none transition-all resize-none"
              />
            </div>
            <div className="p-4 bg-medical-100/30 rounded-xl border border-medical-200/50 flex items-start gap-3">
              <Activity className="text-medical-600 shrink-0" size={18} />
              <p className="text-xs text-medical-800 leading-relaxed">
                <span className="font-bold">AI Prediction:</span> Personalized medicine and treatment plans will be automatically generated based on the clinical data provided below.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Vitals & Lifestyle (Requested Fields) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-medical-600">
            <Activity size={18} />
            <h3 className="font-bold text-sm uppercase tracking-wider">Vitals & Lifestyle</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Glucose (mg/dL)</label>
                  <input 
                    type="number" 
                    value={formData.glucose}
                    onChange={e => setFormData({...formData, glucose: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">A1C Result</label>
                  <select 
                    value={formData.A1Cresult}
                    onChange={e => setFormData({...formData, A1Cresult: e.target.value as any})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                  >
                    <option value="none">None</option>
                    <option value="normal">Normal</option>
                    <option value=">7">&gt;7</option>
                    <option value=">8">&gt;8</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.highBloodPressure ? 'bg-medical-600 border-medical-600' : 'bg-white border-slate-300 group-hover:border-medical-400'}`}>
                    {formData.highBloodPressure && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <input 
                    type="checkbox" 
                    hidden
                    checked={formData.highBloodPressure}
                    onChange={e => setFormData({...formData, highBloodPressure: e.target.checked})}
                  />
                  High BP
                </label>
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.smoking ? 'bg-medical-600 border-medical-600' : 'bg-white border-slate-300 group-hover:border-medical-400'}`}>
                    {formData.smoking && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <input 
                    type="checkbox" 
                    hidden
                    checked={formData.smoking}
                    onChange={e => setFormData({...formData, smoking: e.target.checked})}
                  />
                  Smoker
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase">Daily Steps</label>
                  <span className="text-xs font-bold text-medical-600">{formData.steps.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="20000" step="500"
                  value={formData.steps}
                  onChange={e => setFormData({...formData, steps: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-medical-600"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase">Heart Rate</label>
                  <span className="text-xs font-bold text-medical-600">{formData.heartRate} bpm</span>
                </div>
                <input 
                  type="range" 
                  min="40" max="120"
                  value={formData.heartRate}
                  onChange={e => setFormData({...formData, heartRate: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-medical-600"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Data Toggle */}
        <div className="pt-2">
          <button 
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-medical-600 transition-colors uppercase tracking-widest"
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${showAdvanced ? 'bg-medical-100 border-medical-200 text-medical-600' : 'border-slate-300'}`}>
              {showAdvanced ? '-' : '+'}
            </div>
            {showAdvanced ? 'Hide Advanced Clinical Data' : 'Add Advanced Clinical Data (Biomarkers, Genetic)'}
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Section 4: Advanced Clinical Biomarkers */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Activity size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wider">Advanced Biomarkers</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Cholesterol (mg/dL)</label>
                  <input 
                    type="number" 
                    value={formData.cholesterol}
                    onChange={e => setFormData({...formData, cholesterol: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Serum Creatinine</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={formData.serumCreatinine}
                    onChange={e => setFormData({...formData, serumCreatinine: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Ejection Fraction (%)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="10" max="80"
                    value={formData.ejectionFraction}
                    onChange={e => setFormData({...formData, ejectionFraction: parseInt(e.target.value)})}
                    className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-medical-600"
                  />
                  <span className="text-sm font-bold text-slate-700 w-8">{formData.ejectionFraction}%</span>
                </div>
              </div>
            </section>

            {/* Section 5: Genetic Markers */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Dna size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wider">Genetic Markers</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['BRCA1', 'BRCA2', 'APOE4', 'MTHFR', 'CYP2D6'].map(marker => (
                  <button
                    key={marker}
                    type="button"
                    onClick={() => toggleMarker(marker)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                      formData.geneticMarkers.includes(marker)
                        ? 'bg-medical-600 text-white border-medical-600'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-medical-300'
                    }`}
                  >
                    {marker}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="shrink-0 p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={isPredicting}
          className={`flex-1 py-3.5 rounded-2xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
            isPredicting 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-medical-600 text-white shadow-medical-600/20 hover:bg-medical-700'
          }`}
        >
          {isPredicting ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              AI Predicting...
            </>
          ) : (
            'Create Patient Profile'
          )}
        </button>
      </div>
    </form>
  );
}
