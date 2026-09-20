import React, { useState, useMemo } from 'react';
import { CourseCategoryName, Lesson } from '../types';
import { ALL_LESSONS, COURSE_CATEGORIES } from '../data/lessons';
import { 
  Play, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Search, 
  Filter, 
  CheckCheck, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

interface LessonListScreenProps {
  categoryName: CourseCategoryName;
  watchedLessonIds: number[];
  onSelectLesson: (lessonId: number) => void;
  onToggleWatched: (lessonId: number) => void;
  onMarkCategoryAll: (categoryName: CourseCategoryName, markWatched: boolean) => void;
}

export const LessonListScreen: React.FC<LessonListScreenProps> = ({
  categoryName,
  watchedLessonIds,
  onSelectLesson,
  onToggleWatched,
  onMarkCategoryAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unwatched' | 'watched'>('all');

  const categoryInfo = COURSE_CATEGORIES.find((c) => c.name === categoryName);
  const categoryLessons = useMemo(() => {
    return ALL_LESSONS.filter((l) => l.category === categoryName);
  }, [categoryName]);

  const filteredLessons = useMemo(() => {
    return categoryLessons.filter((lesson) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return filterByType(lesson);

      const matchesSearch =
        lesson.title.toLowerCase().includes(q) ||
        lesson.description.toLowerCase().includes(q) ||
        lesson.topics.some((t) => t.toLowerCase().includes(q)) ||
        `${lesson.id}`.includes(q) ||
        `#${lesson.id}`.includes(q);

      return matchesSearch && filterByType(lesson);
    });

    function filterByType(lesson: Lesson) {
      const isWatched = watchedLessonIds.includes(lesson.id);
      if (filterType === 'unwatched') return !isWatched;
      if (filterType === 'watched') return isWatched;
      return true;
    }
  }, [categoryLessons, searchQuery, filterType, watchedLessonIds]);

  const watchedCount = categoryLessons.filter((l) => watchedLessonIds.includes(l.id)).length;
  const totalCount = categoryLessons.length;
  const isAllWatched = watchedCount === totalCount && totalCount > 0;
  const progressPercent = Math.round((watchedCount / totalCount) * 100);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 font-sans pb-16">
      {/* Category Header Banner */}
      <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wide text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            {categoryInfo?.lessonRange || 'سرفصل آموزشی'}
          </span>
          <span className="text-xs text-slate-300 font-medium">
            {watchedCount} از {totalCount} جلسه تکمیل شده ({progressPercent}٪)
          </span>
        </div>

        <h2 className="text-base font-bold text-white leading-tight">
          {categoryName}
        </h2>
        {categoryInfo?.englishSubtitle && (
          <span className="text-xs text-slate-400 font-sans block" dir="ltr">
            {categoryInfo.englishSubtitle}
          </span>
        )}

        {categoryInfo?.description && (
          <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
            {categoryInfo.description}
          </p>
        )}

        {/* Quick category actions */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-700/50">
          <div className="w-1/2 bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <button
            id="btn-toggle-all-category"
            onClick={() => onMarkCategoryAll(categoryName, !isAllWatched)}
            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 active:text-emerald-500 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {isAllWatched ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>بازنشانی وضعیت سرفصل</span>
              </>
            ) : (
              <>
                <CheckCheck className="w-3.5 h-3.5" />
                <span>علامت‌گذاری همه به عنوان مشاهده‌شده</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Helpful Hint (راهنمای انتخاب درس) */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-850/60 rounded-xl border border-slate-800 text-[11px] text-slate-300">
        <Info className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>برای پخش هر درس روی عنوان یا آیکون پخش کلیک کنید. با دکمه تیک می‌توانید وضعیت تماشا را تغییر دهید.</span>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="input-search-lessons"
            type="text"
            placeholder="جستجوی درس، شماره جلسه یا مبحث مورد نظر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            همه جلسات ({categoryLessons.length})
          </button>
          <button
            onClick={() => setFilterType('unwatched')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'unwatched'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            مشاهده نشده ({categoryLessons.length - watchedCount})
          </button>
          <button
            onClick={() => setFilterType('watched')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterType === 'watched'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            دیده‌شده ({watchedCount})
          </button>
        </div>
      </div>

      {/* List of Lessons (Sequential 1 to 120) */}
      <div className="space-y-2.5">
        {filteredLessons.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs bg-slate-850/40 rounded-2xl border border-dashed border-slate-800">
            هیچ جلسه‌ای مطابق با جستجوی شما یافت نشد.
          </div>
        ) : (
          filteredLessons.map((lesson) => {
            const isWatched = watchedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                id={`lesson-card-${lesson.id}`}
                className={`group rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
                  isWatched
                    ? 'bg-slate-850/60 border-slate-700/60 opacity-90'
                    : 'bg-slate-800/90 border-slate-700 hover:border-emerald-500/50 shadow-sm'
                }`}
              >
                <div className="p-3.5 flex items-start gap-3">
                  {/* Sequential Lesson Number Badge */}
                  <div
                    onClick={() => onSelectLesson(lesson.id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs cursor-pointer ${
                      isWatched
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-900 text-slate-200 border border-slate-700 group-hover:border-emerald-500'
                    }`}
                  >
                    #{lesson.id}
                  </div>

                  {/* Lesson Meta */}
                  <div
                    onClick={() => onSelectLesson(lesson.id)}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono" dir="ltr">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {lesson.duration}
                      </span>
                      {isWatched && (
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/70 px-1.5 py-0.2 rounded border border-emerald-800/50">
                          مشاهده شد ✓
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mt-0.5 leading-snug">
                      {lesson.title}
                    </h3>

                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {lesson.description}
                    </p>

                    {/* Topic Chips */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {lesson.topics.slice(0, 3).map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-900/90 text-slate-300 text-[10px] rounded-md border border-slate-700/50"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Watched Checkbox & Play Button */}
                  <div className="flex flex-col items-center gap-2 shrink-0 pt-0.5">
                    {/* Watched Toggle (Room/DataStore persistence trigger) */}
                    <button
                      id={`btn-toggle-watched-${lesson.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatched(lesson.id);
                      }}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        isWatched
                          ? 'text-emerald-400 hover:text-emerald-300 bg-emerald-950/60'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                      }`}
                      title={isWatched ? 'تغییر به مشاهده نشده' : 'ثبت به عنوان مشاهده شده'}
                    >
                      {isWatched ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    {/* Quick Play Trigger */}
                    <button
                      id={`btn-play-lesson-${lesson.id}`}
                      onClick={() => onSelectLesson(lesson.id)}
                      className="p-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 transition-colors cursor-pointer"
                      title="پخش ویدیو"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
