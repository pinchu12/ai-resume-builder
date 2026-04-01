import { memo, type ChangeEvent } from "react";
import type { FilterCategory } from "../store/templateStore";

interface TemplateFilterProps {
  active: FilterCategory;
  searchQuery: string;
  onFilterChange: (value: FilterCategory) => void;
  onSearchChange: (value: string) => void;
}

const categories: FilterCategory[] = ["All", "ATS Friendly", "Professional", "Creative", "Minimal"];

function TemplateFilter({
  active,
  searchQuery,
  onFilterChange,
  onSearchChange
}: TemplateFilterProps) {
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <section className="sticky top-0 z-20 mb-5 rounded-2xl border border-slate-200/70 bg-white/90 p-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/85">
      <div className="mb-3 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            aria-label={`Filter ${category} templates`}
            onClick={() => onFilterChange(category)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active === category
                ? "bg-sky-600 text-white shadow"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <input
        aria-label="Search templates by name"
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search template name..."
        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-900 outline-none ring-sky-500 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      />
    </section>
  );
}

export default memo(TemplateFilter);
