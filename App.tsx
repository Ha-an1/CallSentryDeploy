import React from 'react';
import PhoneSimulator from './components/PhoneSimulator';
import { ShieldCheck, Lock, Activity, Brain } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-slate-100 font-sans selection:bg-primary/30 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-primary to-accent p-2 rounded-lg shadow-lg shadow-primary/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">CallSentry</h1>
          </div>
          {/* Navigation links removed as requested */}
          <div></div>
        </div>
      </nav>

      <main className="relative">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[0%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 lg:pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
                Stop Scams <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Before They Ring.</span>
              </h1>
              
              <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                CallSentry is an intelligent call anomaly detection system that screens incoming calls, interacts with callers, and detects fraudulent intent using AI-driven conversation analysis.
                <br/><br/>
                It filters out scams before they reach you, keeping your time and privacy safe.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="#demo" className="px-8 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/25 transition transform hover:-translate-y-0.5 text-center">
                  Try Live Demo
                </a>
                <a href="#features" className="px-8 py-3.5 rounded-full bg-surface border border-slate-700 hover:bg-slate-800 text-white font-medium transition text-center">
                  Why CallSentry?
                </a>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-emerald-500" size={18} />
                  <span>Real-time Audio Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="text-emerald-500" size={18} />
                  <span>End-to-End Privacy</span>
                </div>
              </div>
            </div>

            {/* Right Content - Phone Demo */}
            <div className="relative flex justify-center lg:justify-end" id="demo">
              {/* Decorative circle behind phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-3xl -z-10" />
              
              <div className="relative animate-float">
                <div className="absolute -right-12 top-20 bg-surface/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-xl z-20 hidden md:block animate-bounce-slow">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Status</p>
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    AI Protection Active
                  </div>
                </div>

                <PhoneSimulator />
              </div>
            </div>

          </div>
        </div>

        {/* Feature Strip */}
        <div id="features" className="border-t border-slate-800 bg-surface/30 backdrop-blur-sm scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-10">
              <h3 className="text-lg font-semibold text-white">Why CallSentry?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition duration-300">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                  <Activity />
                </div>
                <h4 className="text-white font-medium mb-2">Anomaly Detection</h4>
                <p className="text-sm text-slate-400">Our advanced models detect shifts in tone, urgency, and keywords associated with known scams.</p>
              </div>

              {/* Feature 2 (Updated) */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition duration-300">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-accent">
                  <Brain />
                </div>
                <h4 className="text-white font-medium mb-2">Hybrid Intelligence</h4>
                <p className="text-sm text-slate-400">
                  Our fraud detection model was trained on an extensive dataset of scam patterns and combined with Gemini for natural, adaptive communication.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition duration-300">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-emerald-500">
                  <ShieldCheck />
                </div>
                <h4 className="text-white font-medium mb-2">Autonomous Screening</h4>
                <p className="text-sm text-slate-400">The AI answers for you, interrogates unknown callers, and only rings you if it's important.</p>
              </div>

            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} CallSentry AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;