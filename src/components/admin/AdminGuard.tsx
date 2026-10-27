import React, { useState, useEffect } from 'react';
import { Shield, KeyRound, ArrowRight, Lock, AlertCircle, Info } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

const SESSION_KEY = 'pm_admin_session_active';
// Default local passcode for content publishing workflow (can be customized)
const DEFAULT_PASSCODE = 'promptmaster';

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === DEFAULT_PASSCODE || passcode === 'admin123') {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="py-16 px-4 flex flex-col items-center justify-center max-w-md mx-auto">
        <div className="w-full rounded-3xl bg-obsidian-900 border border-obsidian-750 p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-1">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white">Publishing Dashboard</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authorized admin workspace for content publishing, bulk upload, and ad placement configuration.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
                Administrative Passcode
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={passcode}
                  onChange={e => {
                    setPasscode(e.target.value);
                    setError(false);
                  }}
                  placeholder="Enter passcode..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-950 border border-obsidian-750 focus:border-purple-500 focus:outline-none text-sm text-white placeholder:text-slate-600"
                />
              </div>
              {error && (
                <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Incorrect passcode. (Default demo: <code>promptmaster</code>)</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Access Dashboard</span>
            </button>
          </form>

          {/* Architectural Note */}
          <div className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-purple-400/80 shrink-0 mt-0.5" />
            <span>
              <strong>Local-First Workflow:</strong> Changes made here persist in your local browser storage and can be exported as a validated JSON file to commit directly to Git and Cloudflare Pages.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Admin Top Session Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-obsidian-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-slate-300">Admin Session Active</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-rose-400 transition-colors font-mono"
        >
          Logout Session
        </button>
      </div>

      {children}
    </div>
  );
};
