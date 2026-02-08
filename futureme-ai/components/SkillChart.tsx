
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer
} from 'recharts';
import { Skill } from '../types';

interface SkillChartProps {
  data: Skill[];
}

export const SkillChart: React.FC<SkillChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64 mt-4 bg-slate-800/50 rounded-xl p-2 border border-slate-700/50">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="#818cf8"
            fill="#818cf8"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
