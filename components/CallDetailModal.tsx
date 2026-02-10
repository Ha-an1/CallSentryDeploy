import React, { useState } from 'react';
import { CallData, AnomalySeverity } from '../types';
import { analyzeCallWithGemini, GeminiAnalysisResult } from '../services/geminiService';
import { X, Sparkles, User, Headphones, AlertOctagon, Check, ShieldAlert } from 'lucide-react';

interface CallDetailModalProps {
  call: CallData;
  onClose: () => void;
}

const CallDetailModal: React.FC<CallDetailModalProps> = ({ call, onClose }) => {
  const [analysis, setAnalysis] = useState<GeminiAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGeminiAnalysis = async () => {
    setLoading(true);
    const result = await analyzeCallWithGemini(call);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm">
      <div className="h-full w-full max-w-2xl bg-surface border-l border-slate-700 shadow-2xl overflow-y-auto animate-slide-in">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 sticky top-0 bg-surface z-10 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              Call Details <span className="text-slate-500 font-mono text-base font-normal">#{call.id}</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Started {new Date(call.startTime).toLocaleString()}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Risk Score</span>
              <div className={`text-2xl font-bold mt-1 ${call.riskScore > 80 ? 'text-red-400' : 'text-emerald-400'}`}>
                {call.riskScore}/100
              </div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Sentiment</span>
              <div className="text-2xl font-bold mt-1 text-blue-400">
                {call.sentimentScore.toFixed(2)}
              </div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Anomalies</span>
              <div className="text-2xl font-bold mt-1 text-orange-400">
                {call.anomalies.length}
              </div>
            </div>
          </div>

          {/* Gemini AI Analysis Section */}
          <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl p-6 border border-indigo-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                <Sparkles size={18} />
                Gemini AI Analysis
              </h3>
              {!analysis && (
                <button
                  onClick={handleGeminiAnalysis}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Generate Report'}
                </button>
              )}
            </div>

            {loading && (
              <div className="py-8 text-center text-indigo-300/60 animate-pulse">
                Processing transcript and detecting compliance violations...
              </div>
            )}

            {analysis && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                  <p className="text-sm text-slate-300 leading-relaxed">{analysis.summary}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-lg">
                    <span className="text-xs text-red-400 uppercase font-bold">Root Cause</span>
                    <p className="text-sm text-slate-300 mt-1">{analysis.rootCause}</p>
                  </div>
                  <div className="p-3 bg-emerald-900/10 border border-emerald-500/20 rounded-lg">
                    <span className="text-xs text-emerald-400 uppercase font-bold">Recommendation</span>
                    <p className="text-sm text-slate-300 mt-1">{analysis.recommendation}</p>
                  </div>
                </div>

                <div className={`flex items-center gap-2 text-sm font-medium p-3 rounded-lg ${analysis.complianceCheck ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                   {analysis.complianceCheck ? <Check size={16} /> : <ShieldAlert size={16} />}
                   {analysis.complianceCheck ? 'Compliance Verified' : 'Compliance Risk Detected'}
                </div>
              </div>
            )}
          </div>

          {/* Transcript */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Transcript</h3>
            <div className="space-y-4 font-mono text-sm max-h-96 overflow-y-auto pr-2">
              {call.transcript.map((line, index) => (
                <div key={index} className={`flex gap-4 ${line.speaker === 'agent' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-2 rounded-lg max-w-[80%] ${
                    line.speaker === 'agent' 
                      ? 'bg-blue-600/10 text-blue-200 border border-blue-500/20' 
                      : 'bg-slate-700/50 text-slate-200 border border-slate-600'
                  }`}>
                    <div className="flex items-center gap-2 mb-1 opacity-50 text-xs">
                       {line.speaker === 'agent' ? <Headphones size={10} /> : <User size={10} />}
                       <span>{line.speaker}</span>
                       <span>•</span>
                       <span>00:{line.timestamp.toString().padStart(2, '0')}</span>
                    </div>
                    {line.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anomalies List */}
          {call.anomalies.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Detected Anomalies</h3>
              <div className="space-y-2">
                {call.anomalies.map((a) => (
                  <div key={a.id} className="p-3 bg-slate-800/50 border border-red-500/30 rounded-lg flex gap-4 items-start">
                    <div className="p-2 bg-red-500/10 rounded text-red-500 mt-1">
                      <AlertOctagon size={18} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{a.type}</h4>
                      <p className="text-sm text-slate-400">{a.description}</p>
                      <div className="flex gap-3 mt-2 text-xs">
                        <span className="text-red-400 font-mono">Severity: {a.severity}</span>
                        <span className="text-slate-500">Confidence: {(a.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CallDetailModal;