import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CallData } from '../types';

interface AnomalyChartProps {
  data: CallData[];
}

const AnomalyChart: React.FC<AnomalyChartProps> = ({ data }) => {
  // Transform CallData into chart-friendly format
  // Group by minute (mock logic for demo)
  const chartData = data
    .slice(0, 20)
    .map((call, index) => ({
      time: new Date(call.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      risk: call.riskScore,
      sentiment: (call.sentimentScore + 1) * 50, // Normalize to 0-100
    }))
    .reverse();

  return (
    <div className="bg-surface border border-slate-700 rounded-xl p-6 shadow-lg h-full">
      <h3 className="text-white font-semibold mb-6">Real-time Risk Analysis</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="risk" 
              stroke="#ef4444" 
              fillOpacity={1} 
              fill="url(#colorRisk)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="sentiment" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorSentiment)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnomalyChart;