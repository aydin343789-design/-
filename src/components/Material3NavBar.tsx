import React from 'react';
import { Layers, ListVideo, BarChart3, Code2 } from 'lucide-react';
import { Screen } from '../types';

interface Material3NavBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  watchedCount: number;
  totalLessons: number;
}

export const Material3NavBar: React.FC<Material3NavBarProps> = ({
  currentScreen,
  onNavigate,
  watchedCount,
  totalLessons,
}) => {
  const isCategories = currentScreen.type === 'categories' || currentScreen.type === 'category_lessons';
  const isAllLessons = currentScreen.type === 'all_lessons';
  const isPlayer = currentScreen.type === 'video_player';
  const isKotlinSource = currentScreen.type === 'kotlin_source';

  return (
    <nav className="sticky bottom-0 z-20 bg-slate-900 border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {/* Tab 1: Categories */}
      <button
        id="nav-tab-categories"
        onClick={() => onNavigate({ type: 'categories' })}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
          isCategories
            ? 'bg-emerald-500/15 text-emerald-400 font-bold'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <Layers className={`w-5 h-5 ${isCategories ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        <span className="text-[11px] mt-0.5 tracking-tight font-medium">سرفصل‌ها</span>
      </button>

      {/* Tab 2: All 120 Lessons */}
      <button
        id="nav-tab-all-lessons"
        onClick={() => onNavigate({ type: 'all_lessons' })}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
          isAllLessons
            ? 'bg-emerald-500/15 text-emerald-400 font-bold'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <ListVideo className={`w-5 h-5 ${isAllLessons ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        <span className="text-[11px] mt-0.5 tracking-tight font-medium">تمام ۱۲۰ جلسه</span>
        <span className="absolute top-0.5 left-1.5 px-1 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold rounded-full">
          {totalLessons}
        </span>
      </button>

      {/* Tab 3: Current Video Player (if active) */}
      {isPlayer && (
        <button
          id="nav-tab-player"
          className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl bg-amber-500/20 text-amber-300 font-bold animate-pulse cursor-pointer"
        >
          <div className="w-2 h-2 rounded-full bg-amber-400 mb-0.5"></div>
          <span className="text-[11px] tracking-tight font-medium">پخش جلسه {currentScreen.lessonId}</span>
        </button>
      )}

      {/* Tab 4: Native Android Kotlin Source Code */}
      <button
        id="nav-tab-kotlin"
        onClick={() => onNavigate({ type: 'kotlin_source' })}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
          isKotlinSource
            ? 'bg-indigo-500/20 text-indigo-300 font-bold'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <Code2 className={`w-5 h-5 ${isKotlinSource ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        <span className="text-[11px] mt-0.5 tracking-tight font-medium">کدهای کاتلین</span>
      </button>
    </nav>
  );
};
