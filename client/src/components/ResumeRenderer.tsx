import { Suspense, lazy, memo, useMemo } from "react";
import { useTemplateStore, type ResumeData, type RendererTemplateId } from "../store/templateStore";

const ClassicTemplate = lazy(() => import("../templates/ClassicTemplate"));
const ProfessionalTemplate = lazy(() => import("../templates/ProfessionalTemplate"));
const ATSFriendlyTemplate = lazy(() => import("../templates/ATSFriendlyTemplate"));

const templateMap = {
  classic: ClassicTemplate,
  professional: ProfessionalTemplate,
  ats: ATSFriendlyTemplate
};

interface ResumeRendererProps {
  data?: ResumeData;
}

function ResumeRenderer({ data }: ResumeRendererProps) {
  const selectedTemplateId = useTemplateStore((state) => state.selectedTemplateId);
  const resumeDataFromStore = useTemplateStore((state) => state.resumeData);

  const TemplateComponent = useMemo(() => {
    return templateMap[selectedTemplateId as RendererTemplateId] || ClassicTemplate;
  }, [selectedTemplateId]);

  const effectiveData = data || resumeDataFromStore;

  return (
    <Suspense fallback={<div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">Loading template...</div>}>
      <TemplateComponent data={effectiveData} />
    </Suspense>
  );
}

export default memo(ResumeRenderer);
