import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isFramed: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, isFramed }) => {
  if (!isFramed) {
    return (
      <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
        <div className="w-full max-w-4xl min-h-screen bg-slate-900 border-x border-slate-800 flex flex-col shadow-2xl">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 py-4 px-2 sm:py-6 sm:px-4 flex items-center justify-center overflow-x-hidden">
      {/* Android Device Outer Bezel */}
      <div className="relative w-full max-w-[420px] h-[860px] max-h-[92vh] bg-black rounded-[48px] p-3.5 shadow-2xl ring-1 ring-slate-800 border-4 border-slate-800/80 flex flex-col overflow-hidden">
        
        {/* Device Speaker & Camera Punch Hole */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
          <div className="w-3.5 h-3.5 bg-black rounded-full ring-2 ring-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
          </div>
        </div>

        {/* Android Status Bar */}
        <div className="h-7 w-full bg-slate-900 text-slate-300 text-xs px-6 flex items-center justify-between z-20 select-none border-b border-slate-800/40" dir="ltr">
          <span className="font-semibold text-[11px] tracking-wide text-slate-200">۰۹:۴۱</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5 text-[10px] font-medium">
              <span>۹۸٪</span>
              <BatteryMedium className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* App Content Canvas */}
        <div className="flex-1 w-full bg-slate-900 overflow-hidden flex flex-col relative">
          {children}
        </div>

        {/* Android Gesture Navigation Bar */}
        <div className="h-4 w-full bg-slate-900 flex items-center justify-center z-20">
          <div className="w-28 h-1 bg-slate-500/60 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
