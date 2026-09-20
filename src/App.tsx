import React, { useState, useEffect } from 'react';
import { CourseCategoryName, Screen } from './types';
import { ALL_LESSONS, COURSE_CATEGORIES } from './data/lessons';
import { AndroidFrame } from './components/AndroidFrame';
import { Material3TopBar } from './components/Material3TopBar';
import { Material3NavBar } from './components/Material3NavBar';
import { CategoryListScreen } from './components/CategoryListScreen';
import { LessonListScreen } from './components/LessonListScreen';
import { VideoPlayerScreen } from './components/VideoPlayerScreen';
import { AllLessonsScreen } from './components/AllLessonsScreen';
import { KotlinSourceViewer } from './components/KotlinSourceViewer';

const STORAGE_KEY_WATCHED = 'android_video_course_watched_ids';
const STORAGE_KEY_LAST_LESSON = 'android_video_course_last_lesson_id';

export default function App() {
  // Navigation stack (replicating Android NavController backstack)
  const [navStack, setNavStack] = useState<Screen[]>([{ type: 'categories' }]);
  const [isDeviceFramed, setIsDeviceFramed] = useState<boolean>(true);

  // Persistence (Room / DataStore abstraction in localStorage)
  const [watchedLessonIds, setWatchedLessonIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WATCHED);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load watched progress', e);
    }
    // Default initial demonstration progress: first 3 lessons watched
    return [1, 2, 3];
  });

  // Save to persistent storage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WATCHED, JSON.stringify(watchedLessonIds));
    } catch (e) {
      console.error('Failed to save watched progress', e);
    }
  }, [watchedLessonIds]);

  const currentScreen = navStack[navStack.length - 1] || { type: 'categories' };

  // Navigation functions
  const navigateTo = (screen: Screen) => {
    setNavStack((prev) => [...prev, screen]);
    if (screen.type === 'video_player') {
      try {
        localStorage.setItem(STORAGE_KEY_LAST_LESSON, screen.lessonId.toString());
      } catch {}
    }
  };

  const navigateBack = () => {
    if (navStack.length > 1) {
      setNavStack((prev) => prev.slice(0, prev.length - 1));
    }
  };

  const navigateTab = (targetScreen: Screen) => {
    // Reset backstack to single destination
    setNavStack([targetScreen]);
  };

  // Watched state toggling
  const toggleWatched = (lessonId: number) => {
    setWatchedLessonIds((prev) => {
      if (prev.includes(lessonId)) {
        return prev.filter((id) => id !== lessonId);
      } else {
        return [...prev, lessonId];
      }
    });
  };

  // Batch mark category
  const markCategoryAll = (categoryName: CourseCategoryName, markWatched: boolean) => {
    const categoryLessonIds = ALL_LESSONS.filter((l) => l.category === categoryName).map((l) => l.id);
    setWatchedLessonIds((prev) => {
      if (markWatched) {
        // Add all missing
        const set = new Set([...prev, ...categoryLessonIds]);
        return Array.from(set);
      } else {
        // Remove all from category
        return prev.filter((id) => !categoryLessonIds.includes(id));
      }
    });
  };

  // Top Bar title & subtitle computation
  let topBarTitle = 'دوره برنامه‌نویسی اندروید';
  let topBarSubtitle = 'کاتلین و Jetpack Compose';
  let showBackButton = navStack.length > 1;

  if (currentScreen.type === 'categories') {
    topBarTitle = 'سرفصل‌های آموزشی دوره';
    topBarSubtitle = '۱۲۰ جلسه ویدیویی برنامه‌نویسی';
    showBackButton = false;
  } else if (currentScreen.type === 'category_lessons') {
    topBarTitle = currentScreen.categoryName;
    const cat = COURSE_CATEGORIES.find((c) => c.name === currentScreen.categoryName);
    topBarSubtitle = cat?.lessonRange || 'جلسات این سرفصل';
    showBackButton = true;
  } else if (currentScreen.type === 'video_player') {
    const lesson = ALL_LESSONS.find((l) => l.id === currentScreen.lessonId);
    topBarTitle = `جلسه ${currentScreen.lessonId}`;
    topBarSubtitle = lesson?.title || 'پخش ویدیوی آموزشی';
    showBackButton = true;
  } else if (currentScreen.type === 'all_lessons') {
    topBarTitle = 'فهرست تمام ۱۲۰ جلسه';
    topBarSubtitle = 'نقشه راه یادگیری از ابتدا تا انتها';
    showBackButton = false;
  } else if (currentScreen.type === 'kotlin_source') {
    topBarTitle = 'سورس کدهای کاتلین اندروید';
    topBarSubtitle = 'پروژه کامل Android Studio و Media3';
    showBackButton = false;
  }

  return (
    <AndroidFrame isFramed={isDeviceFramed}>
      {/* Material 3 TopAppBar */}
      <Material3TopBar
        title={topBarTitle}
        subtitle={topBarSubtitle}
        showBack={showBackButton}
        onBack={navigateBack}
        isDeviceFramed={isDeviceFramed}
        onToggleFrame={() => setIsDeviceFramed(!isDeviceFramed)}
      />

      {/* Screen Router */}
      <main className="flex-1 flex flex-col min-h-0 bg-slate-900 text-slate-100 overflow-hidden">
        {currentScreen.type === 'categories' && (
          <CategoryListScreen
            watchedLessonIds={watchedLessonIds}
            onSelectCategory={(categoryName) =>
              navigateTo({ type: 'category_lessons', categoryName })
            }
            onResumeLesson={(lessonId) =>
              navigateTo({ type: 'video_player', lessonId })
            }
          />
        )}

        {currentScreen.type === 'category_lessons' && (
          <LessonListScreen
            categoryName={currentScreen.categoryName}
            watchedLessonIds={watchedLessonIds}
            onSelectLesson={(lessonId) =>
              navigateTo({ type: 'video_player', lessonId })
            }
            onToggleWatched={toggleWatched}
            onMarkCategoryAll={markCategoryAll}
          />
        )}

        {currentScreen.type === 'video_player' && (
          <VideoPlayerScreen
            lessonId={currentScreen.lessonId}
            isWatched={watchedLessonIds.includes(currentScreen.lessonId)}
            onToggleWatched={toggleWatched}
            onNavigateToLesson={(nextId) => {
              // Replace current player screen with next lesson
              setNavStack((prev) => [...prev.slice(0, prev.length - 1), { type: 'video_player', lessonId: nextId }]);
            }}
            onBackToCategory={(categoryName) => {
              navigateTo({ type: 'category_lessons', categoryName: categoryName as CourseCategoryName });
            }}
          />
        )}

        {currentScreen.type === 'all_lessons' && (
          <AllLessonsScreen
            watchedLessonIds={watchedLessonIds}
            onSelectLesson={(lessonId) =>
              navigateTo({ type: 'video_player', lessonId })
            }
            onToggleWatched={toggleWatched}
          />
        )}

        {currentScreen.type === 'kotlin_source' && <KotlinSourceViewer />}
      </main>

      {/* Material 3 Bottom NavigationBar */}
      <Material3NavBar
        currentScreen={currentScreen}
        onNavigate={navigateTab}
        watchedCount={watchedLessonIds.length}
        totalLessons={ALL_LESSONS.length}
      />
    </AndroidFrame>
  );
}
