import React, { useState, useMemo } from 'react';
import { CourseCategoryName, Lesson } from '../types';
import { ALL_LESSONS, COURSE_CATEGORIES } from '../data/lessons';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Search, 
  GraduationCap
} from 'lucide-react';

interface AllLessonsScreenProps {
  watchedLessonIds: number[];
  onSelectLesson: (lessonId: number) => void;
  onToggleWatched: (lessonId: number) => void;
}

export const AllLessonsScreen: React.FC<AllLessonsScreenProps> = ({
  watchedLessonIds,
  onSelectLesson,
  onToggleWatched,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه سرفصل‌ها');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unwatched' | 'watched'>('all');

  const filteredLessons = useMemo(() => {
    return ALL_LESSONS.filter((lesson) => {
      const matchesCategory = selectedCategory === 'همه سرفصل‌ها' || lesson.category === selectedCategory;
      const isWatched = watchedLessonIds.includes(lesson.id);

      const matchesStatus =
        statusFilter === 'all' ? true : statusFilter === 'watched' ? isWatched : !isWatched;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lesson.title.toLowerCase().includes(q) ||
        lesson.description.toLowerCase().includes(q) ||
        lesson.category.toLowerCase().includes(q) ||
        lesson.topics.some((t) => t.toLowerCase().includes(q)) ||
        `${lesson.id}`.includes(q) ||
        `#${lesson.id}`.includes(q);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [searchQuery, selectedCategory, statusFilter, watchedLessonIds]);

  const watchedCount = watchedLessonIds.length;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 font-sans pb-16">
      {/* Header Info Banner */}
      <div className="flex items-center justify-between bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>فهرست تمام ۱۲۰ جلسه دوره</span>
          </h2>
          <p className="text-[11px] text-slate-300">
            نقشه راه گام‌به‌گام از جلسه ۱ تا جلسه ۱۲۰
          </p>
        </div>
        <div className="text-left">
          <span className="text-xs font-bold text-emerald-400 font-sans">
            {watchedCount} از ۱۲۰
          </span>
          <p className="text-[10px] text-slate-400">جلسه دیده شده</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="جستجو در تمام ۱۲۰ جلسه (مثلاً کاتلین، دیتابیس Room، انیمیشن)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-9 pl-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('همه سرفصل‌ها')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            selectedCategory === 'همه سرفصل‌ها'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          همه سرفصل‌ها (۱۲۰)
        </button>
        {COURSE_CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.name
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results Count & Status Filter */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>نمایش {filteredLessons.length} جلسه</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2 py-0.5 rounded cursor-pointer ${statusFilter === 'all' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'}`}
          >
            همه
          </button>
          <span>•</span>
          <button
            onClick={() => setStatusFilter('unwatched')}
            className={`px-2 py-0.5 rounded cursor-pointer ${statusFilter === 'unwatched' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'}`}
          >
            مشاهده نشده
          </button>
          <span>•</span>
          <button
            onClick={() => setStatusFilter('watched')}
            className={`px-2 py-0.5 rounded cursor-pointer ${statusFilter === 'watched' ? 'text-emerald-400 font-bold' : 'hover:text-slate-200'}`}
          >
            دیده‌شده
          </button>
        </div>
      </div>

      {/* Lesson Cards List */}
      <div className="space-y-2">
        {filteredLessons.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs bg-slate-850/50 rounded-2xl border border-slate-800">
            هیچ جلسه‌ای با فیلترهای انتخابی شما یافت نشد.
          </div>
        ) : (
          filteredLessons.map((lesson) => {
            const isWatched = watchedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className={`group rounded-2xl border p-3 flex items-start gap-3 transition-all cursor-pointer ${
                  isWatched
                    ? 'bg-slate-850/60 border-slate-700/50 opacity-85'
                    : 'bg-slate-800/90 border-slate-700 hover:border-emerald-500/50 shadow-sm'
                }`}
              >
                {/* Number Badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                    isWatched
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-900 text-slate-200 border border-slate-700 group-hover:border-emerald-500'
                  }`}
                >
                  #{lesson.id}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-400/90 truncate">
                      {lesson.category}
                    </span>
                    <span className="text-slate-600 text-[10px]">•</span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5" dir="ltr">
                      <Clock className="w-2.5 h-2.5" />
                      {lesson.duration}
                    </span>
                    {isWatched && (
                      <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.2 rounded">
                        ✓
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors mt-0.5 truncate">
                    {lesson.title}
                  </h3>

                  <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                    {lesson.description}
                  </p>
                </div>

                {/* Watched Action */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWatched(lesson.id);
                  }}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
                    isWatched
                      ? 'text-emerald-400 hover:text-emerald-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title={isWatched ? 'تغییر به مشاهده نشده' : 'ثبت به عنوان مشاهده شده'}
                >
                  {isWatched ? (
                    <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
