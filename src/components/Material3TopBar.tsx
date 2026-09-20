import React from 'react';
import { ArrowRight, Smartphone, Monitor } from 'lucide-react';

interface Material3TopBarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  actions?: React.ReactNode;
  isDeviceFramed?: boolean;
  onToggleFrame?: () => void;
}

export const Material3TopBar: React.FC<Material3TopBarProps> = ({
  title,
  subtitle,
  onBack,
  showBack = false,
  actions,
  isDeviceFramed,
  onToggleFrame,
}) => {
  return (
    <header className="sticky top-0 z-20 bg-slate-900 text-slate-100 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between transition-colors shadow-sm select-none">
      <div className="flex items-center gap-2.5 min-w-0">
        {showBack && onBack ? (
          <button
            id="btn-nav-back"
            onClick={onBack}
            className="p-2 -mr-1.5 rounded-full hover:bg-slate-800 active:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="بازگشت به مرحله قبل"
            aria-label="بازگشت"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
        )}
        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold tracking-tight text-white truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-slate-400 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {actions}
        {onToggleFrame && (
          <button
            id="btn-toggle-device-frame"
            onClick={onToggleFrame}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 active:bg-slate-750 transition-colors flex items-center gap-1.5 border border-slate-700/70 mr-1 cursor-pointer"
            title={isDeviceFramed ? 'تغییر به نمای تمام‌صفحه و عریض' : 'تغییر به نمای شبیه‌ساز گوشی اندروید'}
          >
            {isDeviceFramed ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-medium">نمای عریض</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-medium">قاب گوشی</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
