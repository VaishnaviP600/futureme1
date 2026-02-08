
import React, { useState } from 'react';
import { UserProfile, SimulationResult, Skill } from './types';
import { generateFutureScenarios } from './services/geminiService';
import { UserProfileForm } from './components/UserProfileForm';
import { ScenarioCard } from './components/ScenarioCard';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSimulate = async (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    try {
      const simulation = await generateFutureScenarios(profile);
      setResult(simulation);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError("The chronometer failed to sync. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    // Helper to generate a clean SVG for the download report
    const generateSVG = (skills: Skill[]) => {
      const size = 200;
      const center = size / 2;
      const radius = 60;
      const points = skills.map((s, i) => {
        const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
        const valRadius = (s.value / 100) * radius;
        return `${center + valRadius * Math.cos(angle)},${center + valRadius * Math.sin(angle)}`;
      }).join(' ');

      const gridLines = [0.2, 0.4, 0.6, 0.8, 1].map(r => {
        const p = skills.map((_, i) => {
          const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
          return `${center + radius * r * Math.cos(angle)},${center + radius * r * Math.sin(angle)}`;
        }).join(' ');
        return `<polygon points="${p}" fill="none" stroke="#e2e8f0" stroke-width="0.5" />`;
      }).join('');

      const axes = skills.map((s, i) => {
        const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        const lx = center + (radius + 20) * Math.cos(angle);
        const ly = center + (radius + 20) * Math.sin(angle);
        return `
          <line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="#e2e8f0" stroke-width="0.5" />
          <text x="${lx}" y="${ly}" text-anchor="middle" font-size="8" fill="#64748b" font-family="sans-serif">${s.subject}</text>
        `;
      }).join('');

      return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
          ${gridLines}
          ${axes}
          <polygon points="${points}" fill="rgba(99, 102, 241, 0.3)" stroke="#6366f1" stroke-width="2" />
        </svg>
      `;
    };

    let htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>FutureMe Personalized Roadmap</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; max-width: 900px; margin: 40px auto; padding: 20px; line-height: 1.6; background: #fff; }
          .report-header { border-bottom: 4px solid #6366f1; margin-bottom: 40px; padding-bottom: 20px; }
          .report-header h1 { margin: 0; color: #1e293b; font-size: 32px; }
          .report-header p { color: #64748b; margin: 5px 0 0 0; }
          .scenario { margin-bottom: 80px; page-break-inside: avoid; border: 1px solid #e2e8f0; border-radius: 20px; padding: 30px; }
          .scenario-title { color: #6366f1; font-size: 26px; margin-top: 0; display: flex; justify-content: space-between; align-items: center; }
          .scenario-age { font-size: 14px; background: #f1f5f9; padding: 4px 12px; border-radius: 20px; color: #475569; }
          .content-grid { display: grid; grid-template-columns: 1fr 280px; gap: 40px; }
          .milestones { list-style: none; padding: 0; }
          .milestones li { margin-bottom: 10px; padding-left: 20px; position: relative; }
          .milestones li::before { content: "•"; color: #6366f1; font-weight: bold; position: absolute; left: 0; }
          .advice-box { background: #f8fafc; border-left: 5px solid #6366f1; padding: 25px; font-style: italic; margin: 30px 0; border-radius: 0 12px 12px 0; font-size: 18px; }
          .action-plan { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 25px; border-radius: 15px; }
          .action-plan h3 { color: #166534; margin-top: 0; }
          .action-plan ol { padding-left: 20px; margin: 0; }
          .chart-container { text-align: center; background: #fafafa; border-radius: 12px; padding: 10px; border: 1px solid #f1f5f9; }
          @media print { .no-print { display: none; } body { margin: 0; padding: 20px; } .scenario { border: none; padding: 0; } }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>Your Future Evolution Roadmap</h1>
          <p>Confidential Life Path Simulation • Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        ${result.scenarios.map((s, i) => `
          <div class="scenario">
            <h2 class="scenario-title">
              <span>Pathway ${i + 1}: ${s.name}</span>
              <span class="scenario-age">Target Age: ${s.age}</span>
            </h2>
            
            <div class="content-grid">
              <div>
                <p><strong>Career Trajectory:</strong> ${s.careerPath}</p>
                <h3>Strategic Milestones</h3>
                <ul class="milestones">
                  ${s.achievements.map(a => `<li>${a}</li>`).join('')}
                </ul>
              </div>
              <div class="chart-container">
                <h4 style="margin: 10px 0; font-size: 12px; text-transform: uppercase; color: #94a3b8;">Skill Radar</h4>
                ${generateSVG(s.skills)}
              </div>
            </div>

            <div class="advice-box">
              "${s.advice}"
            </div>

            <h3>Evolution Strategy</h3>
            <p>${s.personalGrowth}</p>

            <div class="action-plan">
              <h3>Immediate Execution Steps</h3>
              <ol>
                ${s.actionPlan.map(step => `<li>${step}</li>`).join('')}
              </ol>
            </div>
          </div>
        `).join('')}

        <footer style="margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px;">
          <p>Generated by FutureMe AI Simulation Engines. All pathways are possibilities contingent on action.</p>
          <p class="no-print"><strong>Pro Tip:</strong> Press Ctrl+P (Windows) or Cmd+P (Mac) to save this as a high-quality PDF.</p>
        </footer>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FutureMe_Full_Roadmap_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast("Visual roadmap downloaded! Open the file to view.");
  };

  const handleSave = () => {
    if (!result) return;
    try {
      localStorage.setItem('future_me_saved_roadmap', JSON.stringify({
        date: new Date().toISOString(),
        data: result
      }));
      showToast("Simulation saved to your local profile.");
    } catch (e) {
      showToast("Failed to save. Storage might be full.", 'info');
    }
  };

  const resetSimulation = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div className={`${toast.type === 'success' ? 'bg-emerald-600' : 'bg-indigo-600'} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20`}>
            <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}`}></i>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 cursor-pointer" onClick={resetSimulation}>
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <i className="fas fa-atom text-white"></i>
          </div>
          <h1 className="text-xl font-heading font-bold tracking-tight">FutureMe<span className="text-indigo-400">AI</span></h1>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={resetSimulation}
            className="px-4 py-2 rounded-lg border border-slate-700 text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            New Session
          </button>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        {!result && !isLoading && (
          <div className="text-center mb-16 animate-float">
            <h1 className="text-5xl lg:text-7xl font-heading font-extrabold mb-6">
              Witness the <span className="gradient-text">Infinite Versions</span> of You.
            </h1>
            <p className="text-slate-400 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              FutureMe AI simulates potential career and life trajectories based on your current path, providing strategic insights and a concrete roadmap to your dreams.
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-8">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-brain text-indigo-400 text-2xl animate-pulse"></i>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-heading font-bold">Scanning Timelines...</h3>
              <p className="text-slate-400 max-w-md">Gemini is processing potential quantum states and analyzing millions of life vectors to find your optimal futures.</p>
            </div>
          </div>
        ) : result ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-800 pb-8">
              <div>
                <h2 className="text-4xl font-heading font-bold text-white mb-2">Your Projected Realities</h2>
                <p className="text-slate-400 italic">3 distinct pathways discovered for the next 5-10 years.</p>
              </div>
              <button 
                onClick={resetSimulation}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                <i className="fas fa-redo-alt"></i> Try Different Profile
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {result.scenarios.map((scenario, index) => (
                <ScenarioCard key={scenario.id || index} scenario={scenario} index={index} />
              ))}
            </div>

            <div className="glass-panel p-8 rounded-3xl text-center border-indigo-500/30">
              <h3 className="text-2xl font-heading font-bold mb-4 text-white">The choice is yours, traveler.</h3>
              <p className="text-slate-300 max-w-2xl mx-auto mb-8">
                These scenarios are models of what is possible if you focus your energy. Which one resonates most? 
                The common thread across all paths is your willingness to start today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={handleDownload}
                  className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <i className="fas fa-file-download"></i> Download Plan (Visual)
                </button>
                <button 
                  onClick={handleSave}
                  className="bg-slate-700 hover:bg-slate-600 px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <i className="fas fa-bookmark"></i> Save to Profile
                </button>
              </div>
            </div>
          </div>
        ) : (
          <UserProfileForm onSubmit={handleSimulate} isLoading={isLoading} />
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center flex items-center justify-center gap-3">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}
      </main>

      <footer className="mt-24 p-12 border-t border-slate-800 bg-slate-900/50">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <i className="fas fa-atom text-indigo-500"></i>
            <span className="font-heading font-bold text-lg">FutureMe AI</span>
          </div>
          <div className="text-slate-500 text-sm">
            © 2025 FutureMe Simulation Labs. All futures are possible.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
