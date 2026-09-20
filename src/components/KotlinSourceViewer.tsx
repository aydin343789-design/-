import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES, AndroidCodeFile } from '../data/androidCodeSnippets';
import { Copy, Check, FileCode, Terminal } from 'lucide-react';

export const KotlinSourceViewer: React.FC = () => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = ANDROID_PROJECT_FILES[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 font-sans pb-16">
      {/* Overview Banner */}
      <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wide text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
            پروژه نیتیو کاتلین و Jetpack Compose
          </span>
          <span className="text-xs text-slate-400 font-sans" dir="ltr">
            {ANDROID_PROJECT_FILES.length} فایل سورس کد
          </span>
        </div>

        <h2 className="text-base font-bold text-white leading-tight">
          سورس کدهای واقعی اندروید استودیو (Android Studio)
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          پیاده‌سازی کامل نیتیو با استفاده از <strong>AndroidX Media3 ExoPlayer</strong>، زبان طراحی <strong>Material 3</strong> و پایگاه‌داده محلی <strong>Room SQLite</strong>.
        </p>
      </div>

      {/* File Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" dir="ltr">
        {ANDROID_PROJECT_FILES.map((file, idx) => (
          <button
            key={file.filename}
            onClick={() => {
              setActiveFileIndex(idx);
              setCopied(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFileIndex === idx
                ? 'bg-indigo-600 text-white font-bold shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-300" />
            <span>{file.filename}</span>
          </button>
        ))}
      </div>

      {/* Code Editor Preview Box */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        {/* Code Header Bar */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div dir="ltr" className="text-left">
            <span className="text-xs font-mono font-bold text-indigo-400 block">
              {activeFile.filename}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">
              {activeFile.packagePath}
            </span>
          </div>

          <button
            id="btn-copy-kotlin-code"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">کپی شد! ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>کپی سورس کد</span>
              </>
            )}
          </button>
        </div>

        {/* File Description */}
        <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800/80 text-[11px] text-slate-300">
          💡 {activeFile.description}
        </div>

        {/* Code Content */}
        <pre className="p-4 overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-200 selection:bg-indigo-500/30" dir="ltr">
          <code>{activeFile.code}</code>
        </pre>
      </div>

      {/* Android Studio Instructions Card */}
      <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 text-xs text-slate-300 space-y-2">
        <h3 className="font-bold text-white flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>راهنمای اجرای این پروژه در Android Studio:</span>
        </h3>
        <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
          <li>در نرم‌افزار Android Studio یک پروژه جدید با قالب <strong>Empty Compose Activity</strong> ایجاد کنید.</li>
          <li>کتابخانه‌های Media3 ExoPlayer و دیتابیس Room را از فایل <code>build.gradle.kts</code> به پروژه خود اضافه نمایید.</li>
          <li>فایل‌های کاتلین <code>MainActivity.kt</code>، <code>VideoPlayerScreen.kt</code> و <code>CourseDatabase.kt</code> را در پوشه کدهای خود قرار دهید.</li>
          <li>برنامه را کامپایل کرده و روی شبیه‌ساز یا گوشی واقعی اندروید ۷.۰ به بالا (API 24+) اجرا (Run) کنید.</li>
        </ol>
      </div>
    </div>
  );
};
