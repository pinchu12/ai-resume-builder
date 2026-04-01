import { useEffect, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ResumeTemplate } from "../data/templates";

interface PreviewModalProps {
  template: ResumeTemplate | null;
  open: boolean;
  onClose: () => void;
  onUse: (template: ResumeTemplate) => void;
}

export default function PreviewModal({ template, open, onClose, onUse }: PreviewModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const onDialogKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && template && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${template.name} preview modal`}
            tabIndex={-1}
            onKeyDown={onDialogKey}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-2xl border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{template.name}</h3>
              <button
                type="button"
                aria-label="Close preview"
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold dark:bg-slate-800"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            <img
              src={template.thumbnail}
              alt={`${template.name} large preview`}
              className="mb-4 max-h-[70vh] w-full rounded-xl object-cover"
            />

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                ATS {template.atsScore}
              </span>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                {template.category}
              </span>
              {template.premium && (
                <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-slate-900">
                  Premium
                </span>
              )}
            </div>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{template.description}</p>

            <button
              type="button"
              aria-label={`Use ${template.name}`}
              onClick={() => onUse(template)}
              className="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700"
            >
              Use Template
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
