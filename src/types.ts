export interface Lesson {
  id: number; // 1 to 120 sequential
  title: string;
  category: CourseCategoryName;
  duration: string;
  durationSeconds: number;
  description: string;
  videoUrl: string;
  topics: string[];
}

export type CourseCategoryName =
  | 'مبانی زبان کاتلین'
  | 'شی‌گرایی و کاتلین پیشرفته'
  | 'اصول Jetpack Compose'
  | 'مدیریت State و ناوبری'
  | 'معماری MVVM و دیتابیس Room'
  | 'پخش ویدیو با Media3 ExoPlayer'
  | 'کامپوز پیشرفته و انیمیشن'
  | 'پروژه‌های عملی و انتشار اپلیکیشن';

export interface CourseCategory {
  name: CourseCategoryName;
  englishSubtitle: string;
  description: string;
  lessonRange: string; // e.g. "جلسات ۱ تا ۱۵"
  startId: number;
  endId: number;
  colorScheme: {
    container: string;
    onContainer: string;
    indicator: string;
    accent: string;
  };
  icon: string;
}

export interface UserProgress {
  watchedLessonIds: number[];
  lastWatchedLessonId?: number;
  lastWatchedTimestamp?: number;
}

export type Screen =
  | { type: 'categories' }
  | { type: 'category_lessons'; categoryName: CourseCategoryName }
  | { type: 'all_lessons' }
  | { type: 'video_player'; lessonId: number; fromScreen?: 'categories' | 'category_lessons' | 'all_lessons' }
  | { type: 'kotlin_source' };
