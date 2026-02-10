import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'default' | 'danger' | 'warning' | 'success';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp,
  color = 'default' 
}) => {
  
  const getBorderColor = () => {
    switch (color) {
      case 'danger': return 'border-red-500/30';
      case 'warning': return 'border-amber-500/30';
      case 'success': return 'border-emerald-500/30';
      default: return 'border-slate-700';
    }
  };

  const getIconColor = () => {
    switch (color) {
      case 'danger': return 'text-red-400';
      case 'warning': return 'text-amber-400';
      case 'success': return 'text-emerald-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className={`bg-surface border ${getBorderColor()} rounded-xl p-6 shadow-lg backdrop-blur-sm bg-opacity-80`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-secondary text-sm font-medium tracking-wide uppercase">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-opacity-10 ${getIconColor()} bg-white`}>
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={trendUp ? 'text-emerald-400' : 'text-red-400'}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
          <span className="text-slate-500 ml-2">vs last hour</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;