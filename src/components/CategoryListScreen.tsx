import React from 'react';
import { CourseCategoryName } from '../types';
import { COURSE_CATEGORIES, ALL_LESSONS } from '../data/lessons';
import { 
  Play, 
  CheckCircle2, 
  ChevronLeft, 
  Code2, 
  Layers, 
  LayoutTemplate, 
  Compass, 
  Database, 
  PlayCircle, 
  Sparkles, 
  Rocket,
  GraduationCap,
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface CategoryListScreenProps {
  watchedLessonIds: number[];
  onSelectCategory: (categoryName: CourseCategoryName) => void;
  onResumeLesson: (lessonId: number) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-5 h-5 text-emerald-400" />,
  Layers: <Layers className="w-5 h-5 text-teal-400" />,
  LayoutTemplate: <LayoutTemplate className="w-5 h-5 text-blue-400" />,
  Compass: <Compass className="w-5 h-5 text-indigo-400" />,
  Database: <Database className="w-5 h-5 text-violet-400" />,
  PlayCircle: <PlayCircle className="w-5 h-5 text-amber-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-rose-400" />,
  Rocket: <Rocket className="w-5 h-5 text-cyan-400" />,
};

export const CategoryListScreen: React.FC<CategoryListScreenProps> = ({
  watchedLessonIds,
  onSelectCategory,
  onResumeLesson,
}) => {
  const totalLessons = ALL_LESSONS.length;
  const watchedCount = watchedLessonIds.length;
  const progressPercent = Math.round((watchedCount / totalLessons) * 100);

  // Determine next unwatched lesson
  const firstUnwatched = ALL_LESSONS.find((l) => !watchedLessonIds.includes(l.id)) || ALL_LESSONS[0];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 font-sans pb-16">
      {/* Course Overall Progress Hero Card (Material 3 Elevated Card) */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-850 rounded-2xl p-4 border border-slate-700/70 shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>دوره جامع و پروژه محور برنامه‌نویسی اندروید</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              ۱۲۰ جلسه ویدیویی آموزشی
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              از مفاهیم پایه‌ای زبان کاتلین تا Jetpack Compose، دیتابیس Room و انتشار در مارکت
            </p>
          </div>

          <div className="text-left shrink-0">
            <span className="text-xl font-extrabold text-emerald-400 font-sans">{progressPercent}٪</span>
            <p className="text-[11px] text-slate-400">{watchedCount} از {totalLessons} جلسه</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950/80 rounded-full h-2.5 mt-3 overflow-hidden border border-slate-700/50">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Resume Button */}
        <div className="mt-3.5 pt-3 border-t border-slate-700/50 flex items-center justify-between">
          <div className="min-w-0 pl-2">
            <span className="text-[11px] text-slate-400 block truncate">جلسه پیشنهادی بعدی:</span>
            <span className="text-xs font-semibold text-slate-200 block truncate">
              جلسه {firstUnwatched.id}: {firstUnwatched.title}
            </span>
          </div>

          <button
            id="btn-resume-course"
            onClick={() => onResumeLesson(firstUnwatched.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>ادامه یادگیری</span>
          </button>
        </div>
      </div>

      {/* Helpful User Guidance Box (راهنمای سریع استفاده) */}
      <div className="bg-slate-850/80 border border-emerald-500/20 rounded-2xl p-3.5 text-xs text-slate-300 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1.5">
          <BookOpen className="w-4 h-4" />
          <span>راهنمای کاربری سریع:</span>
        </div>
        <ul className="space-y-1 text-[11.5px] leading-relaxed text-slate-300 list-disc list-inside">
          <li>روی هر یک از <strong className="text-emerald-300">سرفصل‌های ۸ گانه</strong> زیر کلیک کنید تا جلسات مربوط به آن نمایش داده شود.</li>
          <li>با کلیک روی هر جلسه، ویدیو با <strong className="text-emerald-300">ExoPlayer</strong> پخش شده و پیشرفت شما به صورت خودکار ذخیره می‌شود.</li>
          <li>در بخش <strong className="text-emerald-300">«کدهای کاتلین»</strong> می‌توانید سورس کدهای کامل پروژه اندروید استودیو را کپی کنید.</li>
        </ul>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between px-1 pt-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          سرفصل‌های آموزشی دوره ({COURSE_CATEGORIES.length} بخش)
        </h3>
        <span className="text-[11px] text-slate-400">روی هر سرفصل کلیک کنید</span>
      </div>

      {/* Categories List (LazyColumn representation) */}
      <div className="space-y-3">
        {COURSE_CATEGORIES.map((cat, idx) => {
          // Calculate category progress
          const catLessons = ALL_LESSONS.filter((l) => l.category === cat.name);
          const catWatched = catLessons.filter((l) => watchedLessonIds.includes(l.id)).length;
          const catTotal = catLessons.length;
          const catPercent = Math.round((catWatched / catTotal) * 100);
          const isComplete = catWatched === catTotal && catTotal > 0;

          return (
            <div
              key={cat.name}
              id={`category-card-${idx + 1}`}
              onClick={() => onSelectCategory(cat.name)}
              className="group bg-slate-800/80 hover:bg-slate-800 active:bg-slate-750 border border-slate-700/60 hover:border-emerald-500/40 rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-sm relative overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 bg-slate-700/40"
              >
                <div
                  className="h-full bg-emerald-400/80 transition-all duration-300"
                  style={{ width: `${catPercent}%` }}
                ></div>
              </div>

              <div className="flex items-start gap-3.5">
                {/* Category Icon Badge */}
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 shadow-inner">
                  {CATEGORY_ICONS[cat.icon] || <Layers className="w-5 h-5 text-emerald-400" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-emerald-400/90 tracking-wide">
                      {cat.lessonRange}
                    </span>

                    {isComplete ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        تکمیل شده
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {catWatched} از {catTotal} جلسه دیده شده
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mt-0.5">
                    {cat.name}
                  </h4>
                  <span className="text-[11px] text-slate-400 block mt-0.5 font-sans" dir="ltr">
                    {cat.englishSubtitle}
                  </span>

                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Progress footer */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/40">
                    <span className="font-medium text-slate-300">{catTotal} جلسه ویدیویی</span>
                    <div className="flex items-center gap-1 text-emerald-400 font-medium group-hover:-translate-x-0.5 transition-transform">
                      <span>مشاهده جلسات</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
