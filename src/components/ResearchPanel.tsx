import React from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { 
  Database, 
  Download, 
  Filter, 
  Search, 
  TrendingUp, 
  FlaskConical,
  Table as TableIcon,
  FileSpreadsheet
} from 'lucide-react';
import { MOCK_RESEARCH_DATA } from '../mockData';

export default function ResearchPanel() {
  const data = MOCK_RESEARCH_DATA;

  const exportToCSV = () => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'caremesh_clinical_trials.csv';
    a.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clinical Data Explorer</h1>
          <p className="text-sm text-slate-500">Aggregate patterns across 5,000+ simulated clinical trial records</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
        >
          <FileSpreadsheet size={18} className="text-emerald-600" />
          Export Dataset (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Data Clustering Viz */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Patient Clustering</h3>
            <div className="flex gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">X: Glucose</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Y: Cholesterol</span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="glucose" name="Glucose" unit="mg/dL" domain={[70, 170]} />
                <YAxis type="number" dataKey="cholesterol" name="Cholesterol" unit="mg/dL" domain={[150, 300]} />
                <ZAxis type="number" range={[60, 200]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Patients" data={data}>
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.drugResponse === 'Positive' ? '#10b981' : '#f43f5e'} 
                      fillOpacity={0.6}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-60"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Positive Response</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500 opacity-60"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Negative Response</span>
            </div>
          </div>
        </div>

        {/* Response by Age Group */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Response Rate by Age</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { group: '20-30', positive: 12, negative: 8 },
                { group: '30-40', positive: 18, negative: 10 },
                { group: '40-50', positive: 15, negative: 12 },
                { group: '50-60', positive: 10, negative: 15 },
                { group: '60+', positive: 8, negative: 18 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="group" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Legend iconType="circle" />
                <Bar dataKey="positive" name="Positive Response" fill="#0e8ce4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="negative" name="Negative Response" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trial Patterns Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <TableIcon size={20} className="text-medical-600" />
            <h3 className="font-bold text-slate-900">Clinical Trial Patterns</h3>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Filter results..." 
                className="pl-8 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-medical-500"
              />
            </div>
            <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all border border-slate-200">
              <Filter size={14} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trial ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Biomarkers</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Genetic Marker</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.slice(0, 10).map(row => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">{row.id.toUpperCase()}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-700">{row.age}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">G: {row.glucose}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">C: {row.cholesterol}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">{row.geneticMarker}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      row.drugResponse === 'Positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {row.drugResponse}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button className="text-xs font-bold text-medical-600 hover:text-medical-700">View All 5,000 Records</button>
        </div>
      </div>
    </div>
  );
}
