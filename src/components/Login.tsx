import React, { useState } from 'react';
import { Activity, ShieldCheck, Mail, Lock, ChevronRight, Stethoscope, FlaskConical, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Role, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('doctor');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    const body = isRegistering 
      ? { email, password, name, role }
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLogin(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoRole: Role) => {
    const demoUser: User = {
      id: demoRole === 'doctor' ? 'd1' : 'r1',
      email: `${demoRole}@caremesh.ai`,
      role: demoRole,
      name: demoRole === 'doctor' ? 'Dr. Elena Rodriguez' : 'Dr. Julian Varma'
    };
    onLogin(demoUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-medical-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-medical-800 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-10">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-medical-600 rounded-2xl flex items-center justify-center shadow-xl shadow-medical-600/30 mb-6">
              <Activity className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">CareMesh</h1>
            <p className="text-slate-500 text-sm max-w-[280px]">Personalized Medicine Platform for Clinicians and Researchers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {isRegistering && (
                <motion.div
                  key="register-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. Jane Doe"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Role</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('doctor')}
                        className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                          role === 'doctor' 
                            ? 'bg-medical-600 text-white border-medical-600' 
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-medical-200'
                        }`}
                      >
                        Doctor
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('researcher')}
                        className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                          role === 'researcher' 
                            ? 'bg-medical-600 text-white border-medical-600' 
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-medical-200'
                        }`}
                      >
                        Researcher
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hospital.org"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-medium">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-medical-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-medical-600/20 hover:bg-medical-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : isRegistering ? 'Create Account' : 'Sign In'}
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs font-bold text-medical-600 hover:text-medical-700"
              >
                {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Demo Access</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleDemoLogin('doctor')}
                className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-medical-300 hover:bg-medical-50 transition-all group"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-medical-600 shadow-sm transition-colors">
                  <Stethoscope size={20} />
                </div>
                <span className="text-xs font-bold text-slate-600">Doctor</span>
              </button>
              <button 
                onClick={() => handleDemoLogin('researcher')}
                className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-medical-300 hover:bg-medical-50 transition-all group"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-medical-600 shadow-sm transition-colors">
                  <FlaskConical size={20} />
                </div>
                <span className="text-xs font-bold text-slate-600">Researcher</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          HIPAA & GDPR Compliant Environment
        </div>
      </motion.div>
    </div>
  );
}
