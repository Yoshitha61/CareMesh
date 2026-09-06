import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  Plus, 
  AlertCircle, 
  ChevronRight, 
  TrendingUp, 
  Clock,
  Heart,
  Stethoscope
} from 'lucide-react';
import { Patient } from '../types';
import PatientForm from './PatientForm';
import AnalysisView from './AnalysisView';
import { motion, AnimatePresence } from 'motion/react';

interface DoctorDashboardProps {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  onSelectPatient: (patient: Patient) => void;
  onAddPatient: () => void;
}

export default function DoctorDashboard({ patients, setPatients, onSelectPatient, onAddPatient }: DoctorDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users className="text-medical-600" size={24} />} 
          label="Total Patients" 
          value={patients.length.toString()} 
          trend="+2 this week" 
        />
        <StatCard 
          icon={<AlertCircle className="text-rose-500" size={24} />} 
          label="High Risk Alerts" 
          value={patients.filter(p => p.riskLevel === 'high').length.toString()} 
          trend="Requires attention" 
          urgent
        />
        <StatCard 
          icon={<Activity className="text-emerald-500" size={24} />} 
          label="Active Analyses" 
          value="12" 
          trend="85% success rate" 
        />
        <StatCard 
          icon={<Clock className="text-amber-500" size={24} />} 
          label="Pending Reports" 
          value="4" 
          trend="Next due in 2h" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Patients</h2>
            <button 
              onClick={onAddPatient}
              className="flex items-center gap-2 text-medical-600 bg-medical-50 px-4 py-2 rounded-xl font-bold hover:bg-medical-100 transition-colors"
            >
              <Plus size={18} />
              New Patient
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vitals</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-medical-100 group-hover:text-medical-600 transition-colors">
                          <Users size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.age}y • {p.geneticMarkers[0] || 'No Markers'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        p.riskLevel === 'high' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        p.riskLevel === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {p.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Activity size={12} className="text-medical-500" />
                          {p.glucose}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Heart size={12} className="text-rose-500" />
                          {p.heartRate}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => onSelectPatient(p)}
                        className="p-2 text-slate-400 hover:text-medical-600 hover:bg-medical-50 rounded-lg transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">AI Insights</h2>
          <div className="bg-medical-900 text-white p-6 rounded-2xl shadow-xl shadow-medical-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-medical-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-medical-300" />
                <span className="text-xs font-bold uppercase tracking-widest text-medical-300">Daily Trend</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Predictive Success Up 12%</h3>
              <p className="text-sm text-medical-100/80 mb-6 font-light leading-relaxed">
                New genetic marker correlations found in recent Drug B trials. Consider reviewing patients with BRCA1 markers.
              </p>
              <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-2.5 rounded-xl text-sm font-bold transition-all">
                View Report
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Stethoscope size={16} className="text-medical-600" />
              Clinical Reminders
            </h3>
            <div className="space-y-4">
              <ReminderItem text="Follow up with Jane Smith (High Risk)" time="10:30 AM" color="rose" />
              <ReminderItem text="Review Gene Therapy C results" time="1:00 PM" color="medical" />
              <ReminderItem text="Patient John Doe glucose check" time="3:45 PM" color="amber" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, urgent }: { icon: React.ReactNode, label: string, value: string, trend: string, urgent?: boolean }) {
  return (
    <div className={`bg-white p-6 rounded-2xl border transition-all ${urgent ? 'border-rose-200 shadow-rose-100 shadow-lg' : 'border-slate-200 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${urgent ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
          {trend}
        </span>
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ReminderItem({ text, time, color }: { text: string, time: string, color: string }) {
  const colors: Record<string, string> = {
    rose: 'bg-rose-500',
    medical: 'bg-medical-500',
    amber: 'bg-amber-500'
  };
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className={`w-1.5 h-8 rounded-full ${colors[color]}`}></div>
      <div className="flex-1">
        <p className="text-xs font-bold text-slate-700 group-hover:text-medical-600 transition-colors">{text}</p>
        <p className="text-[10px] text-slate-400">{time}</p>
      </div>
    </div>
  );
}
