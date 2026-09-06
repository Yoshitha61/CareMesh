import React from 'react';
import { 
  TrendingUp, 
  FlaskConical,
  Users,
  Activity,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function ResearcherDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Researcher Overview</h1>
        <p className="text-sm text-slate-500">Welcome back, Dr. Varma. Here's what's happening in your trials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<FlaskConical className="text-medical-600" size={20} />} 
          label="Active Trials" 
          value="12" 
          trend="+2 this month"
          trendUp={true}
        />
        <StatCard 
          icon={<Users className="text-emerald-600" size={20} />} 
          label="Total Cohort" 
          value="5,240" 
          trend="+124 new"
          trendUp={true}
        />
        <StatCard 
          icon={<Activity className="text-amber-600" size={20} />} 
          label="Success Rate" 
          value="68.4%" 
          trend="-1.2% shift"
          trendUp={false}
        />
        <StatCard 
          icon={<ShieldCheck className="text-indigo-600" size={20} />} 
          label="Data Integrity" 
          value="99.9%" 
          trend="Stable"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Research Activity</h3>
          <div className="space-y-6">
            <ActivityItem 
              title="New Genomic Sequence Uploaded" 
              time="2 hours ago" 
              description="Batch 42-A processed with 98% alignment accuracy."
              type="genomic"
            />
            <ActivityItem 
              title="Trial Phase II Completion" 
              time="5 hours ago" 
              description="Targeted therapy for Diabetes Type II cohort finalized."
              type="trial"
            />
            <ActivityItem 
              title="Anomaly Detected in Heart Failure Data" 
              time="Yesterday" 
              description="Unusual correlation between Serum Sodium and Drug B response."
              type="alert"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <QuickActionButton label="Launch New Simulation" />
            <QuickActionButton label="Request Peer Review" />
            <QuickActionButton label="Archive Completed Trials" />
            <QuickActionButton label="Update HIPAA Protocols" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, trendUp }: { icon: React.ReactNode, label: string, value: string, trend: string, trendUp: boolean }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
        <div className={`flex items-center gap-1 text-[10px] font-bold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, time, description, type }: { title: string, time: string, description: string, type: 'genomic' | 'trial' | 'alert' }) {
  const colors = {
    genomic: 'bg-indigo-100 text-indigo-600',
    trial: 'bg-emerald-100 text-emerald-600',
    alert: 'bg-rose-100 text-rose-600'
  };

  return (
    <div className="flex gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[type]}`}>
        <Clock size={20} />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-bold text-slate-900">{title}</h4>
          <span className="text-[10px] text-slate-400 font-medium">{time}</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function QuickActionButton({ label }: { label: string }) {
  return (
    <button className="w-full text-left px-4 py-3 rounded-xl border border-slate-100 hover:border-medical-200 hover:bg-medical-50 text-xs font-bold text-slate-600 hover:text-medical-600 transition-all">
      {label}
    </button>
  );
}
