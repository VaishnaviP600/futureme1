
import React from 'react';
import { FutureScenario } from '../types';
import { SkillChart } from './SkillChart';

interface ScenarioCardProps {
  scenario: FutureScenario;
  index: number;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, index }) => {
  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 flex flex-col h-full border-t-4 border-t-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1 block">Scenario 0{index + 1}</span>
          <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white">{scenario.name}</h3>
        </div>
        <div className="bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600">
          <span className="text-sm font-medium text-slate-300">Age: {scenario.age}</span>
        </div>
      </div>

      <div className="space-y-6 flex-grow">
        <section>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i className="fas fa-briefcase text-indigo-400"></i> Career & Impact
          </h4>
          <p className="text-slate-200 leading-relaxed italic">"{scenario.careerPath}"</p>
        </section>

        <section>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i className="fas fa-chart-line text-indigo-400"></i> Evolution
          </h4>
          <SkillChart data={scenario.skills} />
        </section>

        <section>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i className="fas fa-trophy text-indigo-400"></i> Key Milestones
          </h4>
          <ul className="space-y-2">
            {scenario.achievements.map((item, i) => (
              <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span> {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
          <h4 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i className="fas fa-comment-dots"></i> Message from Future You
          </h4>
          <p className="text-slate-200 text-sm leading-relaxed">{scenario.advice}</p>
        </section>

        <section>
          <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <i className="fas fa-bolt"></i> Immediate Action Plan
          </h4>
          <div className="space-y-2">
            {scenario.actionPlan.map((step, i) => (
              <div key={i} className="bg-slate-800/40 p-3 rounded-lg border border-slate-700 flex gap-3 items-center">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-slate-300 text-xs font-medium">{step}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
