import { memo } from "react";
import type { ResumeData } from "../store/templateStore";

interface TemplateProps {
  data: ResumeData;
}

function ClassicTemplate({ data }: TemplateProps) {
  return (
    <article className="mx-auto w-full max-w-full rounded-xl border border-slate-300 bg-white p-5 text-slate-900 shadow-sm">
      <header className="border-b border-slate-300 pb-3">
        <h2 className="text-2xl font-extrabold">{data.name || "Your Name"}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {[data.email, data.phone, data.address].filter(Boolean).join(" | ") || "your@email.com | +91 ..."}
        </p>
      </header>

      <section className="mt-4">
        <h3 className="border-b border-slate-200 pb-1 text-sm font-bold uppercase tracking-wide">Summary</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">{data.summary || "Professional summary"}</p>
      </section>

      <section className="mt-4">
        <h3 className="border-b border-slate-200 pb-1 text-sm font-bold uppercase tracking-wide">Experience</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-line">{data.experience || "Experience details"}</p>
      </section>

      <section className="mt-4">
        <h3 className="border-b border-slate-200 pb-1 text-sm font-bold uppercase tracking-wide">Skills</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">{data.skills || "Skills"}</p>
      </section>

      <section className="mt-4">
        <h3 className="border-b border-slate-200 pb-1 text-sm font-bold uppercase tracking-wide">Education</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-line">{data.education || "Education"}</p>
      </section>
    </article>
  );
}

export default memo(ClassicTemplate);
