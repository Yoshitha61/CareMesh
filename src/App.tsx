import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FlaskConical, 
  LogOut, 
  Bell, 
  Search, 
  Plus,
  Activity,
  ChevronRight,
  Stethoscope,
  Database,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Patient, User, Role } from './types';
import { MOCK_PATIENTS } from './mockData';
import DoctorDashboard from './components/DoctorDashboard';
import ResearcherDashboard from './components/ResearcherDashboard';
import ResearchPanel from './components/ResearchPanel';
import Login from './components/Login';
import GeminiAssistant from './components/GeminiAssistant';
import AnalysisView from './components/AnalysisView';
import PatientForm from './components/PatientForm';
import { GoogleGenAI, Type } from "@google/genai";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'research' | 'assistant'>('dashboard');
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('caremesh_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const predictTreatment = async (patientData: any) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Predict personalized medicine and suggested treatment plan for this patient:
        Condition: ${patientData.condition}
        Age: ${patientData.age}
        Gender: ${patientData.gender}
        Glucose: ${patientData.glucose}
        A1C: ${patientData.A1Cresult}
        Genetic Markers: ${patientData.geneticMarkers.join(', ')}
        Heart Rate: ${patientData.heartRate}
        Steps: ${patientData.steps}
        High BP: ${patientData.highBloodPressure}
        Smoking: ${patientData.smoking}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalizedMedicine: { type: Type.STRING },
            suggestedTreatmentPlan: { type: Type.STRING }
          },
          required: ["personalizedMedicine", "suggestedTreatmentPlan"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return {
        personalizedMedicine: "Standard Protocol (AI Prediction Failed)",
        suggestedTreatmentPlan: "Consult specialist for personalized plan."
      };
    }
  };

  const handleAddPatient = async (patient: Omit<Patient, 'id' | 'lastUpdated' | 'riskLevel' | 'personalizedMedicine' | 'suggestedTreatmentPlan'>) => {
    setIsPredicting(true);
    try {
      const prediction = await predictTreatment(patient);
      const newPatient: Patient = {
        ...patient,
        ...prediction,
        id: `p${Date.now()}`,
        lastUpdated: new Date().toISOString(),
        riskLevel: patient.glucose > 140 ? 'high' : patient.glucose > 110 ? 'medium' : 'low'
      };
      setPatients([newPatient, ...patients]);
      setIsAddingPatient(false);
    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('caremesh_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('caremesh_user');
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.geneticMarkers.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-medical-500 rounded-xl flex items-center justify-center shadow-lg shadow-medical-500/20">
            <Activity className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight">CareMesh</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="Patients" 
            active={activeTab === 'patients'} 
            onClick={() => setActiveTab('patients')} 
          />
          {user.role === 'researcher' && (
            <SidebarItem 
              icon={<Database size={20} />} 
              label="Research" 
              active={activeTab === 'research'} 
              onClick={() => setActiveTab('research')} 
            />
          )}
          <SidebarItem 
            icon={<MessageSquare size={20} />} 
            label="AI Assistant" 
            active={activeTab === 'assistant'} 
            onClick={() => setActiveTab('assistant')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 mb-4 bg-slate-800/50 rounded-xl">
            <div className="w-8 h-8 bg-medical-400 rounded-full flex items-center justify-center text-xs font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search patients, records, or trials..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-medical-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              <ShieldCheck size={14} className="text-emerald-500" />
              HIPAA Compliant Session
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {selectedPatient ? (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <AnalysisView 
                  patient={selectedPatient} 
                  onBack={() => setSelectedPatient(null)} 
                />
              </motion.div>
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {user.role === 'doctor' ? (
                      <DoctorDashboard 
                        patients={filteredPatients} 
                        setPatients={setPatients} 
                        onSelectPatient={setSelectedPatient}
                        onAddPatient={() => setIsAddingPatient(true)}
                      />
                    ) : (
                      <ResearcherDashboard />
                    )}
                  </motion.div>
                )}
                {activeTab === 'patients' && (
                  <motion.div
                    key="patients"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h1 className="text-2xl font-bold text-slate-900">Patient Directory</h1>
                      <button 
                        onClick={() => setIsAddingPatient(true)}
                        className="flex items-center gap-2 bg-medical-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-medical-700 transition-colors"
                      >
                        <Plus size={20} />
                        Add Patient
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPatients.map(p => (
                        <PatientCard 
                          key={p.id} 
                          patient={p} 
                          onClick={() => setSelectedPatient(p)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                {activeTab === 'research' && user.role === 'researcher' && (
                  <motion.div
                    key="research"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <ResearchPanel />
                  </motion.div>
                )}
                {activeTab === 'assistant' && (
                  <motion.div
                    key="assistant"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="h-full"
                  >
                    <GeminiAssistant patients={patients} />
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="p-4 bg-white border-t border-slate-200 text-[10px] text-slate-400 flex justify-between items-center">
          <div className="flex gap-4">
            <span>Powered by ML (Scikit-learn sim)</span>
            <span>Big Data (Parquet/Polars inspired)</span>
            <span>Streamlit-like UI</span>
          </div>
          <div>© 2024 CareMesh AI • v1.0.4-beta</div>
        </footer>

        {/* Add Patient Modal */}
        <AnimatePresence>
          {isAddingPatient && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddingPatient(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="flex-1 flex flex-col min-h-0">
                  <PatientForm 
                    onSubmit={handleAddPatient} 
                    onCancel={() => setIsAddingPatient(false)} 
                    isPredicting={isPredicting}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-medical-600 text-white shadow-lg shadow-medical-600/20' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
      {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </button>
  );
}

function PatientCard({ patient, onClick }: { patient: Patient, onClick: () => void }) {
  const riskColors = {
    low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-rose-100 text-rose-700 border-rose-200'
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-medical-300 transition-all group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-medical-50 group-hover:text-medical-500 transition-colors">
          <Users size={24} />
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${riskColors[patient.riskLevel]}`}>
          {patient.riskLevel} Risk
        </span>
      </div>
      <h3 className="font-bold text-lg text-slate-900 mb-1">{patient.name}</h3>
      <p className="text-sm text-slate-500 mb-4">{patient.age} years • {patient.gender}</p>
      
      <div className="space-y-3 mb-4">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Condition</p>
          <p className="text-sm font-medium text-slate-700 line-clamp-1">{patient.condition}</p>
        </div>
        <div className="p-3 bg-medical-50 rounded-xl border border-medical-100">
          <p className="text-[10px] text-medical-600 uppercase font-bold mb-1">Personalized Medicine</p>
          <p className="text-sm font-bold text-medical-700 line-clamp-1">{patient.personalizedMedicine}</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
          <p className="text-[10px] text-emerald-600 uppercase font-bold mb-1">Suggested Treatment Plan</p>
          <p className="text-sm font-medium text-emerald-700 line-clamp-1">{patient.suggestedTreatmentPlan}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <span className="text-[10px] text-slate-400 italic">Updated {new Date(patient.lastUpdated).toLocaleDateString()}</span>
        <button className="text-medical-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
          View Details <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
