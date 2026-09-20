import React, { useRef, useState, useEffect } from 'react';
import { Lesson } from '../types';
import { ALL_LESSONS } from '../data/lessons';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Maximize, 
  BookOpen, 
  ListVideo,
  ArrowRight
} from 'lucide-react';

interface VideoPlayerScreenProps {
  lessonId: number;
  isWatched: boolean;
  onToggleWatched: (id: number) => void;
  onNavigateToLesson: (id: number) => void;
  onBackToCategory: (categoryName: string) => void;
}

export const VideoPlayerScreen: React.FC<VideoPlayerScreenProps> = ({
  lessonId,
  isWatched,
  onToggleWatched,
  onNavigateToLesson,
  onBackToCategory,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [autoMarkedNotice, setAutoMarkedNotice] = useState(false);

  const lesson = ALL_LESSONS.find((l) => l.id === lessonId) || ALL_LESSONS[0];

  // Up Next in category or following lessons
  const categoryLessons = ALL_LESSONS.filter((l) => l.category === lesson.category);
  const nextLessonId = lessonId < 120 ? lessonId + 1 : null;
  const prevLessonId = lessonId > 1 ? lessonId - 1 : null;

  // Reset player when lessonId changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = playbackRate;
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted by browser policy; user clicks play
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
    setAutoMarkedNotice(false);
  }, [lessonId]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + seconds));
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(curr);
    setDuration(dur);

    // Auto-mark watched at 88% or when video finishes
    if (dur > 0 && curr / dur >= 0.88 && !isWatched && !autoMarkedNotice) {
      onToggleWatched(lesson.id);
      setAutoMarkedNotice(true);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec === 0) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex-1 overflow-y-auto font-sans flex flex-col pb-16 bg-slate-900">
      {/* Media3 ExoPlayer Video Player Container */}
      <div className="relative w-full aspect-video bg-black sticky top-0 z-10 shadow-lg border-b border-slate-800">
        <video
          ref={videoRef}
          src={lesson.videoUrl}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            setIsPlaying(false);
            if (!isWatched) {
              onToggleWatched(lesson.id);
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-contain cursor-pointer"
          onClick={togglePlay}
        />

        {/* Media3 ExoPlayer style controls overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity flex flex-col justify-between p-3 pointer-events-none">
          {/* Top overlay metadata */}
          <div className="flex items-center justify-between pointer-events-auto">
            <span className="text-xs font-semibold text-white/90 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm truncate max-w-[65%]">
              جلسه {lesson.id} • {lesson.title}
            </span>

            {/* Playback speed selector */}
            <div className="flex items-center gap-1 bg-black/70 rounded-lg p-0.5 backdrop-blur-sm border border-white/10 text-[11px] font-semibold text-white" dir="ltr">
              {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                    playbackRate === s ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:bg-white/15'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Center Play/Pause & Skip buttons */}
          <div className="flex items-center justify-center gap-6 pointer-events-auto" dir="ltr">
            <button
              onClick={() => skipTime(-10)}
              className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-transform active:scale-90 cursor-pointer"
              title="۱۰ ثانیه به عقب"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-transform active:scale-95 shadow-lg cursor-pointer"
              title={isPlaying ? 'توقف' : 'پخش'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => skipTime(10)}
              className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-transform active:scale-90 cursor-pointer"
              title="۱۰ ثانیه به جلو"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Bar: Seekbar & Time */}
          <div className="space-y-1.5 pointer-events-auto">
            {/* Seekbar */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => {
                const newTime = parseFloat(e.target.value);
                setCurrentTime(newTime);
                if (videoRef.current) {
                  videoRef.current.currentTime = newTime;
                }
              }}
              className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            <div className="flex items-center justify-between text-[11px] text-white/90 font-mono" dir="ltr">
              <div className="flex items-center gap-2">
                <span>
                  {formatSeconds(currentTime)} / {formatSeconds(duration || lesson.durationSeconds)}
                </span>
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }
                  }}
                  className="p-1 text-white/80 hover:text-white cursor-pointer"
                  title={isMuted ? 'فعال‌سازی صدا' : 'بی‌صدا کردن'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              <button
                onClick={() => {
                  if (videoRef.current?.requestFullscreen) {
                    videoRef.current.requestFullscreen();
                  }
                }}
                className="p-1 text-white/80 hover:text-white cursor-pointer"
                title="تمام صفحه"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Media3 ExoPlayer Architecture Badge */}
        <div className="absolute top-2.5 right-2.5 pointer-events-none">
          <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md rounded text-[10px] font-sans text-emerald-400 border border-emerald-500/30">
            موتور Media3 ExoPlayer
          </span>
        </div>
      </div>

      {/* Auto-marked completion toast banner */}
      {autoMarkedNotice && (
        <div className="bg-emerald-950/90 border-b border-emerald-800/90 px-4 py-2 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>پیشرفت شما ثبت شد! این جلسه به عنوان مشاهده‌شده علامت‌گذاری گردید.</span>
          </div>
          <button
            onClick={() => setAutoMarkedNotice(false)}
            className="text-emerald-400 hover:text-emerald-200 font-bold px-2 py-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Lesson Details & Material 3 Controls */}
      <div className="p-4 space-y-4">
        {/* Category & Status Row */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => onBackToCategory(lesson.category)}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>{lesson.category}</span>
          </button>

          <button
            id="btn-player-toggle-watched"
            onClick={() => onToggleWatched(lesson.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isWatched
                ? 'bg-emerald-500 text-slate-950 shadow-md hover:bg-emerald-400'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-750'
            }`}
          >
            {isWatched ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>مشاهده شد ✓</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                <span>ثبت به عنوان مشاهده‌شده</span>
              </>
            )}
          </button>
        </div>

        {/* Title and Duration */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-bold text-emerald-400">جلسه {lesson.id} از ۱۲۰</span>
            <span>•</span>
            <span dir="ltr">مدت: {lesson.duration} دقیقه</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
            {lesson.title}
          </h1>
        </div>

        {/* Previous / Next Lesson Navigation Buttons (RTL adjusted) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            id="btn-player-prev-lesson"
            onClick={() => prevLessonId && onNavigateToLesson(prevLessonId)}
            disabled={!prevLessonId}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors ${
              prevLessonId
                ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700 cursor-pointer'
                : 'bg-slate-900 text-slate-400 border-slate-800 cursor-not-allowed opacity-40'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>جلسه قبلی (جلسه {prevLessonId || 1})</span>
          </button>

          <button
            id="btn-player-next-lesson"
            onClick={() => nextLessonId && onNavigateToLesson(nextLessonId)}
            disabled={!nextLessonId}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors ${
              nextLessonId
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400 shadow cursor-pointer'
                : 'bg-slate-900 text-slate-400 border-slate-800 cursor-not-allowed opacity-40'
            }`}
          >
            <span>جلسه بعدی (جلسه {nextLessonId || 120})</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Overview & Topics Covered Card */}
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>توضیحات و اهداف آموزشی این جلسه</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {lesson.description}
          </p>

          <div className="pt-2 border-t border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              مفاهیم کلیدی و کلیدواژه‌های این درس:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {lesson.topics.map((topic, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-slate-900 text-emerald-300 text-[11px] rounded-md border border-slate-700/70"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Up Next in this Category Playlist */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-bold tracking-wide text-slate-300 px-1">
            <div className="flex items-center gap-1.5">
              <ListVideo className="w-4 h-4 text-emerald-400" />
              <span>سایر جلسات این سرفصل ({categoryLessons.length} جلسه)</span>
            </div>
          </div>

          <div className="space-y-2">
            {categoryLessons
              .filter((l) => l.id !== lesson.id)
              .slice(0, 5)
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateToLesson(item.id)}
                  className="bg-slate-800/60 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-bold text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-700 shrink-0">
                      #{item.id}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono" dir="ltr">
                        {item.duration}
                      </span>
                    </div>
                  </div>

                  <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
