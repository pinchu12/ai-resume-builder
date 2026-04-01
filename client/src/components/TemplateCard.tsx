import { memo, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import type { ResumeTemplate } from "../data/templates";

interface TemplateCardProps {
  template: ResumeTemplate;
  isFavorite: boolean;
  onPreview: (template: ResumeTemplate) => void;
  onUse: (template: ResumeTemplate) => void;
  onToggleFavorite: (templateId: string) => void;
}

function TemplateCard({
  template,
  isFavorite,
  onPreview,
  onUse,
  onToggleFavorite
}: TemplateCardProps) {
  const onCardKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onPreview(template);
    }
  };

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="group mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      role="button"
      tabIndex={0}
      onClick={() => onPreview(template)}
      onKeyDown={onCardKey}
      aria-label={`Preview ${template.name}`}
    >
      <div className="relative">
        <img
          src={template.thumbnail}
          alt={`${template.name} preview`}
          loading="lazy"
          decoding="async"
          width={900}
          height={600}
          className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />

        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-emerald-600 px-2 py-1 text-xs font-bold text-white">
            ATS {template.atsScore}
          </span>
          {template.premium && (
            <span className="rounded-full bg-amber-500 px-2 py-1 text-xs font-bold text-slate-900">
              Premium
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={isFavorite ? `Remove ${template.name} from favorites` : `Add ${template.name} to favorites`}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(template.id);
          }}
          className="absolute right-3 top-3 rounded-full bg-black/45 px-2 py-1 text-sm text-white"
        >
          {isFavorite ? "★" : "☆"}
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-900/70 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
          <p className="text-xs text-slate-100">{template.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 p-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{template.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{template.category}</p>
        </div>
        <button
          type="button"
          aria-label={`Use ${template.name}`}
          onClick={(event) => {
            event.stopPropagation();
            onUse(template);
          }}
          className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-sky-700"
        >
          Use Template
        </button>
      </div>
    </motion.article>
  );
}

export default memo(TemplateCard);
