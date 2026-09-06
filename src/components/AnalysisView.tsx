import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { 
  ChevronLeft, 
  Activity, 
  FlaskConical, 
  Zap, 
  Info, 
  Download, 
  RefreshCcw,
  ShieldAlert,
  Dna
} from 'lucide-react';
import { Patient, AnalysisResult, Treatment } from '../types';
import { motion } from 'motion/react';

interface AnalysisViewProps {
  patient: Patient;
  onBack: () => void;
}

export default function AnalysisView({ patient, onBack }: AnalysisViewProps) {
  const [dosage, setDosage] = useState(50);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showExplainability, setShowExplainability] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const runAnalysis = async (currentDosage: number) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientData: patient, dosage: currentDosage })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      runAnalysis(dosage);
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [dosage, patient.id]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analysis Engine</h1>
            <p className="text-sm text-slate-500">Patient: <span className="font-bold text-slate-700">{patient.name}</span> • ID: {patient.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={18} />
            Export FHIR JSON
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-500">
            {isAnalyzing ? (
              <RefreshCcw size={14} className="animate-spin text-medical-600" />
            ) : (
              <Zap size={14} className="text-medical-600" />
            )}
            {isAnalyzing ? 'Simulating...' : 'Engine Active'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Patient Profile & Controls */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
              <Activity size={16} className="text-medical-600" />
              Patient Profile
            </h3>
            <div className="space-y-4">
              <ProfileItem label="Age" value={`${patient.age} years (${patient.gender})`} />
              
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Clinical Summary</p>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Condition</p>
                    <p className="text-xs text-slate-700 leading-relaxed">{patient.condition}</p>
                  </div>
                  <div className="p-3 bg-medical-50 rounded-xl border border-medical-100">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] text-medical-600 uppercase font-bold">Personalized Medicine</p>
                      <span className="text-[8px] font-bold bg-medical-200 text-medical-700 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">AI Predicted</span>
                    </div>
                    <p className="text-xs font-bold text-medical-700">{patient.personalizedMedicine}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] text-emerald-600 uppercase font-bold">Suggested Treatment Plan</p>
                      <span className="text-[8px] font-bold bg-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">AI Predicted</span>
                    </div>
                    <p className="text-xs text-emerald-700 leading-relaxed">{patient.suggestedTreatmentPlan}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Biomarkers & Vitals</p>
                <ProfileItem label="Genetic Markers" value={patient.geneticMarkers.join(', ') || 'None Detected'} highlight={patient.geneticMarkers.length > 0} />
                <ProfileItem label="Blood Glucose" value={`${patient.glucose} mg/dL`} />
                <ProfileItem label="A1C Result" value={patient.A1Cresult} highlight={patient.A1Cresult !== 'normal' && patient.A1Cresult !== 'none'} />
                <ProfileItem label="Ejection Fraction" value={`${patient.ejectionFraction}%`} highlight={patient.ejectionFraction < 40} />
                <ProfileItem label="Serum Creatinine" value={`${patient.serumCreatinine} mg/dL`} highlight={patient.serumCreatinine > 1.3} />
                <ProfileItem label="Heart Rate" value={`${patient.heartRate} bpm`} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Dosage Simulation</h3>
              <span className="text-xs font-bold text-medical-600 bg-medical-50 px-2 py-1 rounded-lg">{dosage}mg</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={dosage} 
              onChange={(e) => setDosage(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-medical-600 mb-6"
            />
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Adjusting dosage updates the predicted success and risk scores based on pharmacokinetic simulations.
            </p>
          </div>

          {result && result.clinicalAlert && (
            <div className={`p-6 rounded-2xl border ${
              result.alertType === 'critical' ? 'bg-rose-50 border-rose-100 text-rose-800' :
              result.alertType === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-800' :
              'bg-emerald-50 border-emerald-100 text-emerald-800'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert size={20} className={
                  result.alertType === 'critical' ? 'text-rose-600' :
                  result.alertType === 'warning' ? 'text-amber-600' :
                  'text-emerald-600'
                } />
                <h3 className="font-bold text-sm uppercase tracking-wider">
                  {result.alertType === 'critical' ? 'Critical Alert' : 
                   result.alertType === 'warning' ? 'Clinical Warning' : 
                   'Clinical Insight'}
                </h3>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {result.clinicalAlert}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Results & Charts */}
        <div className="lg:col-span-2 space-y-8">
          {!result && !isAnalyzing ? (
            <div className="h-[500px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-12 text-center">
              <FlaskConical size={48} className="mb-4 opacity-20" />
              <h3 className="text-lg font-bold text-slate-500 mb-2">Ready for Analysis</h3>
              <p className="text-sm max-w-xs">Click "Run Analysis" to simulate treatment outcomes based on patient biomarkers and lifestyle data.</p>
            </div>
          ) : isAnalyzing ? (
            <div className="h-[500px] bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 relative mb-8">
                <div className="absolute inset-0 border-4 border-medical-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-medical-600 rounded-full border-t-transparent animate-spin"></div>
                <Dna className="absolute inset-0 m-auto text-medical-600 animate-pulse" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Processing Biomarkers</h3>
              <p className="text-sm text-slate-500 max-w-xs">Comparing patient profile against 10,000+ clinical trial records and genetic repositories...</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Treatment Success Chart */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Predicted Treatment Outcomes</h3>
                    <p className="text-xs text-slate-500">Success vs. Risk Probability</p>
                  </div>
                  <button 
                    onClick={() => setShowExplainability(!showExplainability)}
                    className="flex items-center gap-2 text-xs font-bold text-medical-600 hover:bg-medical-50 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Info size={14} />
                    {showExplainability ? 'Hide Explainability' : 'Why this result?'}
                  </button>
                </div>

                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.recommendations} layout="vertical" margin={{ left: 40, right: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" domain={[0, 1]} hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} 
                        width={120}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as Treatment;
                            return (
                              <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800">
                                <p className="text-xs font-bold mb-1">{data.name}</p>
                                <p className="text-[10px] text-slate-400">Success: <span className="text-emerald-400">{(data.success * 100).toFixed(1)}%</span></p>
                                <p className="text-[10px] text-slate-400">Risk: <span className="text-rose-400">{(data.risk * 100).toFixed(1)}%</span></p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="success" radius={[0, 4, 4, 0]} barSize={24}>
                        {result.recommendations.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.success > 0.7 ? '#0e8ce4' : '#94a3b8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {showExplainability && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-8 pt-8 border-t border-slate-100"
                  >
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">SHAP Influence Factors</h4>
                    <div className="space-y-3">
                      {result.explanation.topFactors.map((f, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <span className="text-xs font-medium text-slate-600 w-32 truncate">{f.factor}</span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden flex">
                            <div 
                              className={`h-full ${f.impact > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                              style={{ 
                                width: `${Math.abs(f.impact) * 100}%`,
                                marginLeft: f.impact > 0 ? '50%' : `${50 - Math.abs(f.impact) * 100}%`
                              }}
                            ></div>
                          </div>
                          <span className={`text-[10px] font-bold w-10 ${f.impact > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {f.impact > 0 ? '+' : ''}{(f.impact * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Success vs Risk Scatter */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-8">Risk-Success Matrix</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" dataKey="risk" name="Risk" unit="%" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                      <YAxis type="number" dataKey="success" name="Success" unit="%" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                      <ZAxis type="number" range={[100, 400]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Treatments" data={result.recommendations} fill="#0e8ce4">
                        {result.recommendations.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.success > 0.7 && entry.risk < 0.2 ? '#10b981' : entry.risk > 0.3 ? '#f43f5e' : '#0e8ce4'} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-center gap-6">
                  <LegendItem color="bg-emerald-500" label="Optimal" />
                  <LegendItem color="bg-medical-500" label="Standard" />
                  <LegendItem color="bg-rose-500" label="High Risk" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`font-bold ${highlight ? 'text-medical-600' : 'text-slate-700'}`}>{value}</span>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}
