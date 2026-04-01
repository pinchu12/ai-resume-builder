import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TemplateCard from "../components/TemplateCard";
import TemplateFilter from "../components/TemplateFilter";
import TemplateSkeleton from "../components/TemplateSkeleton";
import { fetchTemplates, type ResumeTemplate } from "../data/templates";
import { useTemplateStore } from "../store/templateStore";

const PreviewModal = lazy(() => import("../components/PreviewModal"));

const pageSize = 6;

function TemplateGalleryPage() {
  const navigate = useNavigate();
  const {
    filters,
    searchQuery,
    loadingState,
    favorites,
    recentlyUsed,
    setFilters,
    setSearchQuery,
    setLoadingState,
    setSelectedTemplate,
    toggleFavorite
  } = useTemplateStore();

  const [allTemplates, setAllTemplates] = useState<ResumeTemplate[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedForPreview, setSelectedForPreview] = useState<ResumeTemplate | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Paginated data loading that behaves like a real API list endpoint.
  const loadPage = useCallback(async (targetPage: number) => {
    if (loadingState || !hasMore) return;

    setLoadingState(true);
    try {
      const response = await fetchTemplates(targetPage, pageSize);
      setAllTemplates((prev) => {
        const merged = [...prev, ...response.data];
        const uniqueById = Array.from(new Map(merged.map((item) => [item.id, item])).values());
        return uniqueById;
      });
      setHasMore(response.hasMore);
      setPage(targetPage);
    } finally {
      setLoadingState(false);
    }
  }, [hasMore, loadingState, setLoadingState]);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loadingState) {
          loadPage(page + 1);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadingState, loadPage, page]);

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return allTemplates.filter((template) => {
      const categoryPass = filters === "All" || template.category === filters;
      const searchPass =
        normalizedQuery.length === 0 ||
        template.name.toLowerCase().includes(normalizedQuery);

      return categoryPass && searchPass;
    });
  }, [allTemplates, filters, searchQuery]);

  const recentTemplates = useMemo(() => {
    const map = new Map(allTemplates.map((item) => [item.id, item]));
    return recentlyUsed.map((id) => map.get(id)).filter(Boolean) as ResumeTemplate[];
  }, [allTemplates, recentlyUsed]);

  const onUseTemplate = useCallback((template: ResumeTemplate) => {
    setSelectedTemplate(template);
    const params = new URLSearchParams({ templateId: template.id });
    navigate(`/editor?${params.toString()}`);
  }, [navigate, setSelectedTemplate]);

  return (
    <main className="min-h-screen bg-linear-to-br from-sky-50 via-white to-slate-100 px-3 py-6 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <section className="mx-auto max-w-7xl">
        <header className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">
            Template Gallery
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Choose a Resume Template</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Explore ATS-friendly, creative, and premium templates with instant preview.
          </p>
        </header>

        <TemplateFilter
          active={filters}
          searchQuery={searchQuery}
          onFilterChange={setFilters}
          onSearchChange={setSearchQuery}
        />

        {recentTemplates.length > 0 && (
          <section className="mb-4 rounded-2xl border border-sky-200 bg-sky-50/70 p-3 dark:border-sky-900 dark:bg-sky-950/30">
            <h2 className="mb-2 text-sm font-bold">Recently Used</h2>
            <div className="flex flex-wrap gap-2">
              {recentTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onUseTemplate(template)}
                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm hover:bg-sky-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </section>
        )}

        <motion.section layout className="columns-1 gap-4 sm:columns-2 xl:columns-3">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isFavorite={favorites.includes(template.id)}
              onToggleFavorite={toggleFavorite}
              onPreview={setSelectedForPreview}
              onUse={onUseTemplate}
            />
          ))}

          {loadingState && Array.from({ length: 3 }).map((_, index) => <TemplateSkeleton key={index} />)}
        </motion.section>

        {!loadingState && filteredTemplates.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
            No templates found for this filter/search.
          </div>
        )}

        <div ref={sentinelRef} aria-hidden className="h-10" />
      </section>

      <Suspense fallback={null}>
        <PreviewModal
          open={Boolean(selectedForPreview)}
          template={selectedForPreview}
          onClose={() => setSelectedForPreview(null)}
          onUse={onUseTemplate}
        />
      </Suspense>
    </main>
  );
}

export default memo(TemplateGalleryPage);
