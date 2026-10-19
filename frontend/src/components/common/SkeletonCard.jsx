import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm animate-pulse flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>

      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <div className="h-5 w-14 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-5 w-14 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="flex space-x-2">
          <div className="h-7 w-7 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-7 w-7 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
