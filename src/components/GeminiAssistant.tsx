import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, RefreshCcw, Info } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { Patient } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface GeminiAssistantProps {
  patients: Patient[];
}

export default function GeminiAssistant({ patients }: GeminiAssistantProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hello! I'm your CareMesh AI Assistant. I can help you analyze patient data, suggest treatment adjustments, or explain clinical patterns. What would you like to know today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = "gemini-3-flash-preview";
      
      const systemInstruction = `
        You are an expert clinical AI assistant for the CareMesh Personalized Medicine Platform.
        You have access to the current patient list: ${JSON.stringify(patients)}.
        Your goal is to provide evidence-based clinical insights, explain genetic markers (like BRCA1, APOE4), 
        and suggest treatment considerations based on the patient's data (age, glucose, cholesterol, lifestyle).
        
        Guidelines:
        - Be professional, concise, and clinical.
        - Always include a disclaimer that you are an AI assistant and clinical decisions must be made by a licensed professional.
        - If asked about a specific patient, use their data to provide a personalized response.
        - Use Markdown for formatting (bolding, lists, etc.).
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [...messages, { role: 'user', content: userMessage }].map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const aiResponse = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered an error while processing your request. Please ensure the API key is configured correctly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-medical-600 rounded-xl flex items-center justify-center shadow-lg shadow-medical-600/20">
            <Bot className="text-white" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Clinical AI Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gemini 3 Flash Active</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all border border-slate-200"
          title="Reset Chat"
        >
          <RefreshCcw size={16} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30"
      >
        {messages.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-medical-600 text-white'
              }`}>
                {m.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
              }`}>
                <div className="markdown-body prose prose-sm max-w-none">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-lg bg-medical-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-tl-none shadow-sm flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium italic">Analyzing clinical data...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Info size={14} className="text-slate-400" />
          <p className="text-[10px] text-slate-400 font-medium italic">
            Try: "Analyze John Doe's risk factors" or "What if Jane Smith's age was +10?"
          </p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask a clinical question..."
            className="w-full pl-6 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-medical-500 outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-medical-600 text-white rounded-xl flex items-center justify-center hover:bg-medical-700 transition-all disabled:opacity-50 shadow-lg shadow-medical-600/20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
