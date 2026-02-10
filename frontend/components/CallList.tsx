import React from 'react';
import { CallData, AnomalySeverity, CallStatus } from '../types';
import { Phone, AlertTriangle, CheckCircle, Activity, MoreHorizontal } from 'lucide-react';

interface CallListProps {
  calls: CallData[];
  onSelectCall: (call: CallData) => void;
}

const CallList: React.FC<CallListProps> = ({ calls, onSelectCall }) => {
  
  const getSeverityColor = (severity: AnomalySeverity) => {
    switch (severity) {
      case AnomalySeverity.CRITICAL: return 'text-red-500 bg-red-500/10 border-red-500/20';
      case AnomalySeverity.HIGH: return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case AnomalySeverity.MEDIUM: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 80) return 'text-red-400';
    if (score > 50) return 'text-orange-400';
    return 'text-emerald-400';
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-700 bg-surface shadow-xl">
      <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Activity size={18} className="text-primary" />
          Live Call Monitor
        </h3>
        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
          {calls.length} Active
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-300 uppercase bg-slate-800/50">
            <tr>
              <th className="px-6 py-3">Call ID / Agent</th>
              <th className="px-6 py-3">Duration</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Risk Score</th>
              <th className="px-6 py-3">Anomalies</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {calls.map((call) => (
              <tr 
                key={call.id} 
                className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                onClick={() => onSelectCall(call)}
              >
                <td className="px-6 py-4 font-medium text-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-slate-700 group-hover:bg-primary/20 transition-colors">
                      <Phone size={16} className="text-slate-300 group-hover:text-primary" />
                    </div>
                    <div>
                      <div className="font-mono text-xs text-slate-500">{call.id}</div>
                      <div>{call.agentId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono">
                  {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    call.status === CallStatus.ACTIVE 
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' 
                    : 'bg-slate-700 text-slate-400 border-slate-600'
                  }`}>
                    {call.status === CallStatus.ACTIVE && <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>}
                    {call.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          call.riskScore > 80 ? 'bg-red-500' : call.riskScore > 50 ? 'bg-orange-500' : 'bg-emerald-500'
                        }`} 
                        style={{ width: `${call.riskScore}%` }}
                      ></div>
                    </div>
                    <span className={`font-mono text-xs ${getRiskColor(call.riskScore)}`}>
                      {call.riskScore}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {call.anomalies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {call.anomalies.map((a, i) => (
                        <span 
                          key={i} 
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${getSeverityColor(a.severity)}`}
                        >
                          <AlertTriangle size={10} />
                          {a.type}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-600 flex items-center gap-1">
                      <CheckCircle size={14} /> Normal
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CallList;