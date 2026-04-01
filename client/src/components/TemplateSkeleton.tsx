import { memo } from "react";

function TemplateSkeleton() {
  return (
    <div className="mb-4 break-inside-avoid rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-3 h-44 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

export default memo(TemplateSkeleton);
